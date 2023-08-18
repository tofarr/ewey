import { FC, Fragment, ReactElement, useState } from 'react';
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
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Navigate,
  Route,
  useParams,
} from "react-router-dom";
import OAuthLoginForm from '../oauth/OAuthLoginForm';
import { useMessageBroker } from '../message/MessageBrokerContext';
import { OpenApiOperation } from './model/OpenApiOperation';
import { useOpenApi } from './OpenApiProvider';
import { useOAuthBearerToken } from '../oauth/OAuthBearerTokenProvider';
import { keyToLabel } from '../eweyField/FieldSetWrapper';
import EweyFactory from '../eweyFactory/EweyFactory';
import JsonSchema from '../eweyFactory/JsonSchema'
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';
import OpenApiProvider from './OpenApiProvider';
import OpenApiQuery from './OpenApiQuery';

export const openApiSummaryRoute = (prefix: string, url: string) => {
  return (
    <Route path={`${prefix}/:op?`} element={
      <OpenApiProvider url={url}>
        <OpenApiSummary />
      </OpenApiProvider>
    } />
  )
}

export interface OpenApiSummaryProps {
  factories?: EweyFactory[]
}

const OpenApiSummary = ({ factories }: OpenApiSummaryProps) => {
  const openApi = useOpenApi()
  const { op } = useParams()
  if (!op) {
    return <Navigate to={openApi.operations[0].operationId} />
  }
  const operation = openApi.operations.find(o => o.operationId === op)
  return (
    <SummaryLayout>
      {operation ? <OperationElement factories={factories} {...operation} /> : <RouteError message="not_found" />}
    </SummaryLayout>
  )
}

interface SummaryLayoutProps {
  children: ReactElement | ReactElement[]
}

const SummaryLayout: FC<SummaryLayoutProps> = ({ children }) => {
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
        to={`../${operationId}`}
        relative="path"
        style={{color: "inherit", textDecoration: "inherit"}}
        onClick={() => setDrawerOpen(false)}>
        {menuItem}
      </Link>
    )
  }

  return (
    <Fragment>
      <AppBar position="static">
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
      {children}
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

export interface OperationElementProps {
  operationId: string
  requiresAuth: boolean
  paramsSchema: JsonSchema
  factories?: EweyFactory[]
}

const OperationElement = ({ operationId, requiresAuth, paramsSchema, factories }: OperationElementProps) => {
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [result, setResult] = useState(null)
  const token = useOAuthBearerToken()
  const messageBroker = useMessageBroker()

  function renderAuth() {
    return <RouteError message="login_to_continue" />
  }

  function renderForm(){
    return (
      <Fragment>
        <OpenApiForm
          operationId={operationId}
          initialValue={{}}
          displaySummary
          onSuccess={(r) => {
            setResult(r)
            setDialogOpen(true)
          }}
          onError={(error) => messageBroker.triggerError(error)} />
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="lg">
          <DialogContent>
            <Box pb={2}>
              <Typography variant="h4">{t(operationId, keyToLabel(operationId))}</Typography>
            </Box>
            <OpenApiContent operationId={operationId} value={result} factories={factories} />
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }

  function renderResults(){
    return (
      <Paper>
        <Box padding={2}>
        <Box pb={2}>
          <Typography variant="h4">{keyToLabel(operationId)}</Typography>
        </Box>
        <OpenApiQuery operationId={operationId} />
        </Box>
      </Paper>
    )
  }

  if (requiresAuth && (!token.token)) {
    return renderAuth()
  }

  if (!Object.keys(paramsSchema.properties).length) {
    return renderResults()
  }

  return renderForm()
}


export default OpenApiSummary
