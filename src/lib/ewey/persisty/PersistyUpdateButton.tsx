import { Fragment, useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
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
import DialogHeader from "../component/DialogHeader";


export interface PersistyUpdateButtonProps {
  initialValues: JsonObjectType
  searchOperationName: string
  updateOperation: OpenApiOperation
}

export function PersistyUpdateButton({ initialValues, searchOperationName, updateOperation }: PersistyUpdateButtonProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<JsonType>(initialValues)
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const isLocked = updateOperation.requiresAuth && !token?.token;
  const [schema, setSchema] = useState<AnySchemaObject | null>(null);
  const [keyAttr, setKeyAttr] = useState<string | null>(null);
  useEffect(() => {
    // Remove attributes which are part of the key from the form
    const { paramsSchema } = updateOperation;
    const { components }  = paramsSchema;
    const itemSchema = resolveRef(paramsSchema.properties.item, paramsSchema.components)
    const properties = { ...itemSchema.properties }
    const newKeyAttr = getKeyAttr(itemSchema);
    setKeyAttr(newKeyAttr)
    delete properties[newKeyAttr]
    const newSchema = {
      ...itemSchema,
      components,
      properties
    }
    setSchema(newSchema)
    const newItem: JsonObjectType = {}
    for (const key in properties){
      newItem[key] = initialValues[key]
    }
    setItem(newItem)
  }, [updateOperation, initialValues])
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const key = initialValues[keyAttr as string];
      (item as JsonObjectType)[keyAttr as string] = key
      const result = await updateOperation.invoke({ item, key }, headers);
      if (result) {
        queryClient.invalidateQueries([searchOperationName], { exact: false });
        messageBroker.triggerMessage(getLabel('item_updated', t))
      } else {
        messageBroker.triggerError(getLabel('update_failed', t))
      }
    },
  });

  return (
    <Fragment>
      <IconButton 
        disabled={isLocked} 
        onClick={() => setDialogOpen(true)}
      >
        <EditIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} disableRestoreFocus>
        <DialogContent>
          <DialogHeader label="update_item" setDialogOpen={setDialogOpen} />
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
                      <Fab disabled={valid && !submitting} color="primary" onClick={() => mutate()}>
                        {submitting ? <CircularProgress size={24} /> : <EditIcon />}
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

function getKeyAttr(schema: AnySchemaObject) {
  const keyAttr = schema.key_config[1].attr_name
  return keyAttr
}