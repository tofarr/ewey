import { Fragment, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { AnySchemaObject } from "../schemaCompiler";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useMessageBroker } from "../message/MessageBrokerContext";
import OpenApiForm from "./OpenApiForm";
import { getLabel } from "../label";
import OpenApiContent from "./OpenApiContent";
import OpenApiQueryContent from "./OpenApiQueryContent";


export interface OpenApiOperationFormProps {
  operationId: string;
  requiresAuth: boolean;
  paramsSchema: AnySchemaObject;
}

export const OpenApiOperationForm = ({
  operationId,
  requiresAuth,
  paramsSchema,
}: OpenApiOperationFormProps) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState(null);
  const token = useOAuthBearerToken();
  const messageBroker = useMessageBroker();
  const queryClient = useQueryClient();

  function renderAuth() {
    return <RouteError message="login_to_continue" />;
  }

  function renderForm() {
    return (
      <Fragment>
        <OpenApiForm
          key={operationId}
          operationId={operationId}
          displaySummary
          onSuccess={(r) => {
            setResult(r);
            setDialogOpen(true);
          }}
          onError={(error) => messageBroker.triggerError(error)}
        />
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent>
            <Box pb={2}>
              <Typography variant="h4">
                {getLabel(operationId, t)}
              </Typography>
            </Box>
            <OpenApiContent operationId={operationId} value={result} />
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }

  function handleRefresh() {
    queryClient.invalidateQueries([operationId], { exact: true });
  }

  function renderResults() {
    return (
      <Paper>
        <Box padding={2}>
          <Box pb={2}>
            <Grid container>
              <Grid item xs>
                <Typography variant="h4">{getLabel(operationId, t)}</Typography>
              </Grid>
              <Grid>
                <Button onClick={handleRefresh}>
                  <RefreshIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>
          <OpenApiQueryContent operationId={operationId} />
        </Box>
      </Paper>
    );
  }

  if (requiresAuth && !token.token) {
    return renderAuth();
  }

  if (!Object.keys(paramsSchema.properties).length) {
    return renderResults();
  }

  return renderForm();
};

interface RouteErrorProps {
  message: string;
}

const RouteError = ({ message }: RouteErrorProps) => {
  const { t } = useTranslation();
  return <Alert severity="error">{getLabel(message, t)}</Alert>;
};

export default OpenApiOperationForm;
