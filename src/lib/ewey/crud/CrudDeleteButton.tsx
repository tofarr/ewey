import { Fragment, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
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
import DialogHeader from "../component/DialogHeader";


export interface CrudDeleteButtonProps {
  itemKey: string
  searchOperationName: string
  deleteOperation: OpenApiOperation
}

export function CrudDeleteButton({ itemKey, searchOperationName, deleteOperation }: CrudDeleteButtonProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const headers = headersFromToken(token?.token);
  const queryClient = useQueryClient()
  const messageBroker = useMessageBroker();
  const isLocked = deleteOperation.requiresAuth && !token?.token;

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const result = await deleteOperation.invoke({ key: itemKey }, headers);
      if (result) {
        queryClient.invalidateQueries([searchOperationName], { exact: false });
        messageBroker.triggerMessage(getLabel('item_deleted', t))
      } else {
        messageBroker.triggerError(getLabel('delete_failed', t))
      }
    },
  });

  
  function handleDelete(){
    setDialogOpen(false)
    mutate()
  }

  return (
    <Fragment>
      <IconButton 
        disabled={isLoading || isLocked} 
        onClick={() => setDialogOpen(true)}
      >
        {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
      </IconButton>
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