import { Fragment, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton"
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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


export interface PersistyCreateButtonProps {
  initialValues?: JsonObjectType
  searchOperationName: string
  createOperation: OpenApiOperation
}

export function PersistyCreateButton({ initialValues, searchOperationName, createOperation }: PersistyCreateButtonProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<JsonType>(null)
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const isLocked = createOperation.requiresAuth && !token?.token;
  const [schema, setSchema] = useState<AnySchemaObject | null>(null);
  useEffect(() => {
    // Remove attributes which are part of the key from the form
    const { paramsSchema } = createOperation;
    const { components }  = paramsSchema;
    const itemSchema = resolveRef(paramsSchema.properties.item, paramsSchema.components)
    const newSchema = {
      ...itemSchema,
      components
    }
    setSchema(newSchema)
    let newItem = initialValues
    if (!newItem) {
      const defaultFactory = newCreateDefaultFnForSchema(itemSchema, components) as (() => JsonObjectType);
      newItem = defaultFactory();
    }
    setItem(newItem as JsonObjectType)
  }, [createOperation, initialValues])
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const result = await createOperation.invoke({ item }, headers);
      if (result) {
        queryClient.invalidateQueries([searchOperationName], { exact: false });
        messageBroker.triggerMessage(getLabel('item_created', t))
        setDialogOpen(false);
      } else {
        messageBroker.triggerError(getLabel('create_failed', t))
      }
    },
  });

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
          <DialogHeader label="create_item" setDialogOpen={setDialogOpen} />
          {schema && (
            <EweyLayoutHintProvider hint={EweyLayoutHint.LABELS_ALWAYS_ABOVE}>
              <EweyForm
                schema={schema}
                isLoading={isLoading}
                value={item}
                onSetValue={setItem}
                onSubmit={() => mutate()}
                submitComponent={({ submitting, valid }) => (
                  <Grid container justifyContent="flex-end" pb={1}>
                    <Grid item>
                      <Fab disabled={!valid || submitting} color="primary" onClick={() => mutate()}>
                        {submitting ? <CircularProgress size={24} /> : <AddIcon />}
                      </Fab>
                    </Grid>
                  </Grid>
                )}
              />
            </EweyLayoutHintProvider>
          )}
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
