import { Fragment, ReactNode, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenApiOperation } from "../../openApi/model/OpenApiOperation";
import { useOAuthBearerToken } from "../../oauth/OAuthBearerTokenProvider";
import { headersFromToken } from "../../openApi/headers";
import { useMessageBroker } from "../../message/MessageBrokerContext";
import { getLabel } from "../../label";
import DialogHeader from "../../component/DialogHeader";
import Result from "../ewey/Result";
import usePersistyOperations from "../usePersistyOperations";
import { isLocked } from "../../oauth/utils";

export interface PersistyDeleteDialogProps {
  storeName: string
  result: Result
  children: (isLoading: boolean, disabled: boolean, setDialogOpen: (open: boolean) => void) => ReactNode;
  onDelete?: () => void;
}

export function PersistyDeleteDialog({ storeName, result, children, onDelete }: PersistyDeleteDialogProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const messageBroker = useMessageBroker();
  const { delete: deleteItem } = usePersistyOperations(storeName)

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const deleteResult = await (deleteItem as OpenApiOperation).invoke({ key: result.key }, headers);
      if (deleteResult) {
        messageBroker.triggerMessage(getLabel('item_deleted', t))
        if (onDelete) {
          onDelete()
        }
      } else {
        messageBroker.triggerError(getLabel('delete_failed', t))
      }
    },
  });

  
  function handleDelete(){
    setDialogOpen(false)
    mutate()
  }

  if (!deleteItem) {
    return null
  }

  return (
    <Fragment>
      {children(isLoading, isLoading || isLocked(deleteItem, token), setDialogOpen)}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader label="confirm_delete" setDialogOpen={setDialogOpen}/>
          <DialogContentText>{t('are_you_sure', 'Are you sure you want to delete this item?')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container padding={2} minWidth={300} justifyContent="flex-end">
            <Grid item>
              <Fab color="primary" onClick={handleDelete}>
                <DeleteIcon />
              </Fab>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}