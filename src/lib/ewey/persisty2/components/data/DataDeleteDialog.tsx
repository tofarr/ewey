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
import usePersistyDataOperations from "../../PersistyDataOperationsProvider";
import Result from "../../Result";
import { useOAuthBearerToken } from "../../../oauth/OAuthBearerTokenProvider";
import { headersFromToken } from "../../../openApi/headers";
import { useMessageBroker } from "../../../message/MessageBrokerContext";
import { OpenApiOperation } from "../../../openApi/model/OpenApiOperation";
import { getLabel } from "../../../label";
import { isLocked } from "../../../oauth/utils";
import DialogHeader from "../../../component/DialogHeader";

export interface DataDeleteDialogProps {
  result: Result
  children: (isLoading: boolean, disabled: boolean, setDialogOpen: (open: boolean) => void) => ReactNode;
  onDelete?: () => void;
}

export default function DataDeleteDialog({ result, children, onDelete }: DataDeleteDialogProps) {
  const { fileCountOp, fileDeleteOp, fileSearchOp } = usePersistyDataOperations()
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const messageBroker = useMessageBroker();
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const deleteResult = await (fileDeleteOp as OpenApiOperation).invoke({ key: result.key }, headers);
      if (deleteResult) {
        messageBroker.triggerMessage(getLabel('item_deleted', t))
        for (const op of [fileCountOp, fileSearchOp]){
          queryClient.invalidateQueries([op?.operationId], { exact: false });
        }
        if (onDelete) {
          onDelete()
        }
      } else {
        messageBroker.triggerError(getLabel('delete_failed', t))
      }
    },
  });
  const disabled = isLoading || !result.deletable || isLocked(fileDeleteOp as OpenApiOperation, token)

  function handleDelete(){
    setDialogOpen(false)
    mutate()
  }

  return (
    <Fragment>
      {children(isLoading, disabled, setDialogOpen)}
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