import { FormEvent, Fragment, useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
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
import SubmitComponent from "../component/SubmitComponent";
import { useOpenApi } from "../openApi/OpenApiProvider";


export interface PersistyDataUploadButtonProps {
  store: string
  initialValues?: JsonObjectType
  searchOperationName: string
  getUploadFormOperation: OpenApiOperation
}

export interface FormField {
  name: string
  value: string
}

export interface UploadForm {
  url: string
  pre_populated_fields?: FormField[] | null
  file_param: string
  expire_at?: string | null
  content_types: string[] | null
}

export function PersistyDataUploadButton({ store, searchOperationName, getUploadFormOperation }: PersistyDataUploadButtonProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const isLocked = getUploadFormOperation.requiresAuth && !token?.token;
  const fileRef = useRef(null)
  const openApi = useOpenApi()
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const result = await getUploadFormOperation.invoke({ key: uuidv4() }, headers) as unknown as UploadForm;
      if (result) {
        const formData = new FormData()
        for (const prePopulatedField of (result.pre_populated_fields || [])) {
          formData.append(prePopulatedField.name, prePopulatedField.value)
        }
        formData.append(result.file_param, (fileRef.current as any).files[0])
        queryClient.invalidateQueries([searchOperationName], { exact: false });
        setDialogOpen(false);
        let url = result.url
        if (!url.startsWith("http:") && !url.startsWith("https:")){
          url = openApi.schema.servers[0].url + url
        }
        fetch(url, {
          method: "POST",
          body: formData
        })
        messageBroker.triggerMessage(getLabel('item_uploaded', t))
      } else {
        messageBroker.triggerError(getLabel('upload_failed', t))
      }
    },
  });
 const valid = true
 const component = store.split("_").map(v => v[0].toUpperCase()+v.substring(1)).join("")
 let content_types = getUploadFormOperation.paramsSchema.components[component].properties.content_type.enum
 if (content_types && content_types.length) {
    content_types = content_types.join(", ")
 } else {
    content_types = undefined
 }

 function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutate()
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
            <form onSubmit={handleSubmit}>
              <Button variant="outlined" component="label">
                Upload
                <input hidden type="file" ref={fileRef} accept={content_types} />
              </Button>
              <SubmitComponent
                submitting={!!isLoading}
                valid={valid}
                onSubmit={() => mutate()}
              />
            </form>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
