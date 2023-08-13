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
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
  Routes,


} from "react-router-dom";

import { useOpenApiSchema } from './OpenApiSchemaContext';
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';

interface Operation {
  path: string
  method: string
  operationId: string
}

interface LayoutProps {
  operations: Operation[]
}

const OpenApiSummary: FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const schema = useOpenApiSchema()
  const operations = getOperations()

  function getOperations(){
    const operations: Operation[] = []
    const paths = schema.schema.paths
    for (const path in paths){
      for (const method in paths[path]) {
        operations.push({ path, method, operationId: paths[path][method].operationId })
      }
    }
    return operations
  }

  return (
    <BrowserRouter>
      <AppBar position="fixed">
        <Toolbar>
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
        <Route path="*" element={<div style={{padding: "100px"}}>Foobar</div>} />
      </Routes>
    </BrowserRouter>
  )
}

const OperationRoute = ({ method, path, operationId }: Operation) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  return (
    <Route key={operationId} path={operationId} element={
      <Fragment>
        <OpenApiForm path={path} method={method} initialValue={{}} onSuccess={(r) => {
          setResult(r)
          setDialogOpen(true)
        }} />
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
