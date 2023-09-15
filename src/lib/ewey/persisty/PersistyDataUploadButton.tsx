import { Fragment, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton"
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import DialogHeader from "../component/DialogHeader";
import { PersistyDataUploadForm, PersistyDataUploadFormProps } from "./PersistyDataUploadForm";

export function PersistyDataUploadButton({ store, getUploadFormOperation, onUpload }: PersistyDataUploadFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const token = useOAuthBearerToken()
  const isLocked = getUploadFormOperation.requiresAuth && !token?.token;
  
  return (
    <Fragment>
      <IconButton 
        disabled={isLocked} 
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} disableRestoreFocus fullWidth>
        <DialogContent>
          <DialogHeader label="upload" setDialogOpen={setDialogOpen} />
          {!isLocked && 
            <PersistyDataUploadForm 
              store={store} 
              getUploadFormOperation={getUploadFormOperation} 
              onUpload={result => {
                setDialogOpen(false)
                if (onUpload) {
                  onUpload(result)
                }
              }}
            />
          }
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
