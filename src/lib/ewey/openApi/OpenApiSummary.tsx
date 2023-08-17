import { FC, Fragment, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

import OAuthLoginForm from '../oauth/OAuthLoginForm';
import { useOpenApiSchema } from './OpenApiSchemaContext';
import OAuthBearerTokenProvider, { useOAuthBearerToken } from '../oauth/OAuthBearerTokenProvider';
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';
import { requiresAuth, getLoginUrl } from './util';

interface Operation {
  path: string
  method: string
  operationId: string
  authUrl: string
}

interface LayoutProps {
  operations: Operation[]
}

const OpenApiSummary: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const schema = useOpenApiSchema()
  const operations = getOperations()
  const { title, version } = schema.schema.info

  function getOperations(){
    const operations: Operation[] = []
    const paths = schema.schema.paths
    for (const path in paths){
      for (const method in paths[path]) {
        const openApiMethod = paths[path][method]
        operations.push({
           path,
            method,
            operationId: openApiMethod.operationId,
            authUrl: requiresAuth(openApiMethod) ? getLoginUrl(schema) : null,
        })
      }
    }
    return operations
  }

  return (
    <OAuthBearerTokenProvider>
      <BrowserRouter>
        <AppBar position="fixed">
          <Toolbar>
            <Grid container alignItems="center">
              <Grid item>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => setDrawerOpen(true)}
                >
                  <MenuIcon color="inherit" />
                </IconButton>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  {version}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {operations.map(operation => (
            <Link
              key={operation.operationId}
              to={operation.operationId}
              style={{color: "inherit", textDecoration: "inherit"}}
              onClick={() => setDrawerOpen(false)}>
              <MenuItem>{operation.operationId}</MenuItem>
            </Link>
          ))}
        </Drawer>
        <Routes>
          {operations.map(OperationRoute)}
          <Route path="*" element={<Navigate to={operations[0].operationId} replace={true} />} />
        </Routes>
      </BrowserRouter>
    </OAuthBearerTokenProvider>
  )
}

const OperationRoute = ({ method, path, operationId, authUrl }: Operation) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  const token = useOAuthBearerToken()

  function renderAuth() {
    return (
      <OAuthLoginForm url={authUrl} />
    )
  }

  function renderForm(){
    return (
      <OpenApiForm path={path} method={method} initialValue={{}} onSuccess={(r) => {
        setResult(r)
        setDialogOpen(true)
      }} />
    )
  }

  return (
    <Route key={operationId} path={operationId} element={
      <Fragment>
        {(authUrl && !token) ? renderAuth() : renderForm()}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}>
          <DialogContent>
            <OpenApiContent
              path={path}
              method={method}
              value={result} />
          </DialogContent>
        </Dialog>
      </Fragment>
    } />
  )
}

export default OpenApiSummary
