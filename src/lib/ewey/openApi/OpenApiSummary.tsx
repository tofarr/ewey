import { FC, Fragment, ReactElement, useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import LockIcon from "@mui/icons-material/Lock";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Link, Navigate, Route, useParams } from "react-router-dom";
import OAuthLoginForm from "../oauth/OAuthLoginForm";
import { OpenApiOperation } from "./model/OpenApiOperation";
import { useOpenApi } from "./OpenApiProvider";
import { BearerToken, useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import EweyFactory from "../eweyFactory/EweyFactory";
import OpenApiProvider from "./OpenApiProvider";
import { getLabel } from "../label";
import OpenApiOperationForm from "./OpenApiOperationForm";
import { OpenApi } from "./model/OpenApi";
import Paper from "@mui/material/Paper";

export const openApiSummaryRoute = (prefix: string, url: string) => {
  return (
    <Route
      path={`${prefix}/:op?`}
      element={
        <OpenApiProvider url={url}>
          <OpenApiSummary />
        </OpenApiProvider>
      }
    />
  );
};

export interface SummaryOperation {
  key: string
  icon: () => ReactElement
  disabled: boolean
  component: () => ReactElement
  categoryKey?: string
}

export interface OpenApiSummaryProps {
  factories?: EweyFactory[];
  operationFactory?: (openApi: OpenApi, token?: BearerToken, factories?: EweyFactory[]) => SummaryOperation[]
}

const OpenApiSummary = ({ factories, operationFactory }: OpenApiSummaryProps) => {
  const openApi = useOpenApi();
  const token = useOAuthBearerToken();
  if (!operationFactory) {
    operationFactory = defaultOperationFactory
  }
  const operations = operationFactory(openApi, token, factories)
  const { op } = useParams();
  if (!op) {
    return <Navigate to={operations[0].key} />;
  }
  const operation = operations.find(o => o.key === op)
  return (
    <SummaryLayout operations={operations} op={op}>
      {operation ? (
        operation.component()
      ) : (
        <RouteError message="not_found" />
      )}
    </SummaryLayout>
  );
};

export function defaultOperationFactory(openApi: OpenApi, token?: BearerToken, factories?: EweyFactory[]): SummaryOperation[] {
  return openApi.operations.map(operation => summaryOperation(operation, token, factories))
}

export function summaryOperation(operation: OpenApiOperation, token?: BearerToken, factories?: EweyFactory[]): SummaryOperation {
  return {
    key: operation.operationId,
    icon: () => operation.requiresAuth ? <LockIcon /> : <PlayArrowIcon />,
    disabled: operation.requiresAuth && !token?.token,
    component: () => (
      <OpenApiOperationForm factories={factories} {...operation} />
    )
  }
}

export interface SummaryLayoutProps {
  operations: SummaryOperation[]
  op: string
  children: ReactElement | ReactElement[];
}

const SummaryLayout: FC<SummaryLayoutProps> = ({ operations, op, children }) => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const openApi = useOpenApi();
  const { title, version } = openApi.schema.info;
  const token = useOAuthBearerToken();

  function handleLogin() {
    if (!token.token) {
      setLoginDialogOpen(true);
      return;
    }
    token.setToken("");
  }

  function renderOperationMenuItem({ key, disabled, icon }: SummaryOperation) {
    let menuItem = (
      <MenuItem key={key} disabled={disabled}>
        <ListItemIcon>
          {icon()}
        </ListItemIcon>
        <ListItemText primary={getLabel(key, t)} />
      </MenuItem>
    );

    return (
      <Link
        key={key}
        to={`../${key}`}
        relative="path"
        style={{ color: "inherit", textDecoration: "inherit" }}
        onClick={() => setDrawerOpen(false)}
      >
        {menuItem}
      </Link>
    );
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
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item>
              <Typography>{version}</Typography>
            </Grid>
            {openApi.loginUrl && (
              <Grid item>
                <IconButton onClick={handleLogin} color="inherit">
                  {token.token ? <KeyOffIcon /> : <KeyIcon />}
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {operations.map(renderOperationMenuItem)}
      </Drawer>
      {openApi.loginUrl && (
        <Dialog
          open={loginDialogOpen && !token.token}
          onClose={() => setLoginDialogOpen(false)}
          disableRestoreFocus
        >
          <DialogContent>
            <Typography variant="h4">
              {getLabel("login", t)}
            </Typography>
            <OAuthLoginForm url={openApi.loginUrl} />
          </DialogContent>
        </Dialog>
      )}
      <Box pt={1} pb={1}>
        <Paper>
          {children}
        </Paper>
      </Box>
    </Fragment>
  );
};

interface RouteErrorProps {
  message: string;
}

const RouteError = ({ message }: RouteErrorProps) => {
  const { t } = useTranslation();
  return <Alert severity="error">{getLabel(message, t)}</Alert>;
};

export default OpenApiSummary;
