import { FC, Fragment, useState } from 'react';
import KeyIcon from '@mui/icons-material/Key';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import OAuthLoginForm from '../oauth/OAuthLoginForm';
import { OpenApiOperation } from './model/OpenApiOperation';
import { useOpenApi } from './OpenApiProvider';
import OAuthBearerTokenProvider, { useOAuthBearerToken } from '../oauth/OAuthBearerTokenProvider';
import { keyToLabel } from '../eweyComponent/FieldSetWrapper';
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';


const OpenApiSummary: FC = () => {
  const openApi = useOpenApi()

  const router = createBrowserRouter(createRoutesFromElements(
    <Route
      path="/"
      element={<SummaryLayout operations={openApi.operations} />}>
      {openApi.operations.map(op => <Route key={op.operationId} path={op.operationId} element={<OperationElement {...op} />} />)}
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
  operations: OpenApiOperation[]
}


const SummaryLayout: FC<SummaryLayoutProps> = ({ operations }) => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const openApi = useOpenApi()
  const { title, version } = openApi.schema.info
  const token = useOAuthBearerToken()

  function handleLogin(){
    if (!token.token){
      setLoginDialogOpen(true)
      return
    }
    token.setToken('')
  }

  function renderOperationMenuItem({ operationId, requiresAuth }: OpenApiOperation){
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
            {openApi.loginUrl &&
              <Grid item>
                <IconButton onClick={handleLogin} color="inherit">
                  {token.token ? <KeyOffIcon /> : <KeyIcon />}
                </IconButton>
              </Grid>
            }
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {openApi.operations.map(renderOperationMenuItem)}
      </Drawer>
      {openApi.loginUrl &&
        <Dialog
          open={loginDialogOpen && !token.token}
          onClose={() => setLoginDialogOpen(false)}>
          <DialogContent>
            <Typography variant="h4">{t('login', keyToLabel('login'))}</Typography>
            <OAuthLoginForm url={openApi.loginUrl} />
          </DialogContent>
        </Dialog>
      }
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


const OperationElement = ({ operationId, requiresAuth }: OpenApiOperation) => {
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  const token = useOAuthBearerToken()

  function renderAuth() {
    return <RouteError message="login_to_continue" />
  }

  function renderForm(){
    return (
      <OpenApiForm operationId={operationId} initialValue={{}} onSuccess={(r) => {
        setResult(r)
        setDialogOpen(true)
      }} displaySummary />
    )
  }

  return (
    <Fragment>
      {(requiresAuth && (!token.token)) ? renderAuth() : renderForm()}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="lg">
        <DialogContent>
          <Box pb={2}>
            <Typography variant="h4">{t(operationId, keyToLabel(operationId))}</Typography>
          </Box>
          <OpenApiContent operationId={operationId} value={result} />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}


export default OpenApiSummary
