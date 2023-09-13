import { Fragment, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton"
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { getLabel } from "../label";
import { headersFromToken } from "../openApi/headers";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useMessageBroker } from "../message/MessageBrokerContext";
import Fab from "@mui/material/Fab";
import JsonType, { JsonObjectType } from "../eweyField/JsonType";
import EweyForm from "../EweyForm";
import CircularProgress from "@mui/material/CircularProgress";
import { EweyLayoutHint, EweyLayoutHintProvider } from "../providers/EweyLayoutHint";
import { AnySchemaObject } from "../schemaCompiler";
import { resolveRef } from "../ComponentSchemas";
import { newCreateDefaultFnForSchema } from "../eweyFactory/ListFactory";
import DialogHeader from "../component/DialogHeader";
import LoadingComponent from "../component/LoadingComponent";
import ErrorComponent from "../component/ErrorComponent";


export interface PersistyDataUploadButtonProps {
  initialValues?: JsonObjectType
  searchOperationName: string
  getUploadFormOperation: OpenApiOperation
}

export function PersistyDataUploadButton({ initialValues, searchOperationName, getUploadFormOperation }: PersistyDataUploadButtonProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const isLocked = getUploadFormOperation.requiresAuth && !token?.token;
  const { data: uploadForm, isLoading, error } = useQuery({
    enabled: dialogOpen,
    queryKey: [getUploadFormOperation.operationId, headers],
    queryFn: async () => {
      debugger
      return getUploadFormOperation.invoke({}, headers)
    },
  });

  function renderUploadForm(){
    if (isLoading){
      return <LoadingComponent />
    }
    if (error){
      return <ErrorComponent />
    }
    return <div>Render form...</div>
  }

  return (
    <Fragment>
      <IconButton 
        disabled={isLocked} 
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} disableRestoreFocus>
        <DialogContent>
          <DialogHeader label="upload" setDialogOpen={setDialogOpen} />
           {renderUploadForm()}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
