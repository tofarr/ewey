import { Fragment, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import { getLabel } from "../label";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import CircularProgress from "@mui/material/CircularProgress";
import { headersFromToken } from "../openApi/OpenApiForm";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";

export interface CrudDeleteButtonProps {
  itemKey: string
  searchOperationName: string
  deleteOperation: OpenApiOperation
}

export function CrudDeleteButton({ itemKey, searchOperationName, deleteOperation }: CrudDeleteButtonProps) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      await deleteOperation.invoke({ key: itemKey }, headers);
      queryClient.invalidateQueries([searchOperationName], { exact: false });
    },
  });

  
  function handleDelete(){
    setDialogOpen(false)
    mutate()
  }

  return (
    <Fragment>
      <Button disabled={isLoading} onClick={() => setDialogOpen(true)}>
        {isLoading ? <CircularProgress /> : <DeleteIcon />}
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{getLabel("confirm_delete", t)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('are_you_sure', 'Are you sure?')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </Button>
          <Button variant="contained" onClick={handleDelete}>
            <DeleteIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}