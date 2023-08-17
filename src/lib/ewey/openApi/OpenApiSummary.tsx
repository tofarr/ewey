import { FC, Fragment, useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
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
import { keyToLabel } from '../eweyComponent/FieldSetWrapper';
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';
import { requiresAuth, getLoginUrl } from './util';

interface Operation {
  path: string
  method: string
  operationId: string
  requiresAuth: boolean
}

interface LayoutProps {
  operations: Operation[]
}

const OpenApiSummary: FC = () => {
  const schema = useOpenApiSchema()
  const operations = getOperations()
  const token = useOAuthBearerToken()

  function getOperations(){
    const operations: Operation[] = []
    const paths = schema.schema.paths
    for (const path in paths){
      for (const method in paths[path]) {
        const openApiMethod = paths[path][method]
        const opRequiresAuth = requiresAuth(openApiMethod)
        operations.push({
            path,
            method,
            operationId: openApiMethod.operationId,
            requiresAuth: opRequiresAuth
        })
      }
    }
    return operations
  }

  const router = createBrowserRouter(createRoutesFromElements(
    <Route
      path="/"
      element={<SummaryLayout operations={operations} />}>
      {operations.map(op => <Route key={op.operationId} path={op.operationId} element={<OperationElement {...op} />} />)}
      <Route key="*" path="*" element={<RouteError message="not_found" />} />
    </Route>
  ));

  return (
    <OAuthBearerTokenProvider>
      <RouterProvider router={router} />
    </OAuthBearerTokenProvider>
  )
}

interface SummaryLayoutProps {
  operations: Operation[]
}


const SummaryLayout: FC<SummaryLayoutProps> = ({ operations }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const schema = useOpenApiSchema()
  const { title, version } = schema.schema.info
  const token = useOAuthBearerToken()

  function handleLogin(){
    if (!token.token){
      setLoginDialogOpen(true)
      return
    }
    token.setToken('')
  }

  function renderOperationMenuItem({ operationId, requiresAuth }: Operation){
    const disabled = requiresAuth && !token.token
    let menuItem = (
      <MenuItem key={operationId} disabled={disabled}>
        <ListItemIcon>
          {requiresAuth ? <LockIcon /> : <PlayArrowIcon />}
        </ListItemIcon>
        <ListItemText primary={keyToLabel(operationId)} />
      </MenuItem>
    )

    return (
      <Link
        key={operationId}
        to={operationId}
        style={{color: "inherit", textDecoration: "inherit"}}
        onClick={() => setDrawerOpen(false)}>
        {menuItem}
      </Link>
    )
  }

  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
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
            <Grid item>
              <IconButton onClick={handleLogin} color="inherit">
                {token.token ? <KeyOffIcon /> : <KeyIcon />}
              </IconButton>
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
        {operations.map(renderOperationMenuItem)}
      </Drawer>
      <Dialog
        open={loginDialogOpen && !token.token}
        onClose={() => setLoginDialogOpen(false)}>
        <DialogContent>
          <OAuthLoginForm url={getLoginUrl(schema)} />
        </DialogContent>
      </Dialog>
      <Outlet />
    </Fragment>
  )
}

interface RouteErrorProps {
  message: string
}

const RouteError = ({ message }: RouteErrorProps) => {
  const { t } = useTranslation()
  return (
    <Alert severity="error">
      {t(message, keyToLabel(message))}
    </Alert>
  )
}


const OperationElement = ({ method, path, operationId, requiresAuth }: Operation) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  const token = useOAuthBearerToken()

  function renderAuth() {
    return <RouteError message="login_to_continue" />
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
    <Fragment>
      {(requiresAuth && (!token.token)) ? renderAuth() : renderForm()}
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
  )
}


export default OpenApiSummary
