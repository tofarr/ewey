import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import { getLabel } from "../label"

export interface DialogHeaderProps {
  label: string
  setDialogOpen: (dialogOpen: boolean) => void
}

const DialogHeader = ({ label, setDialogOpen}: DialogHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Grid container justifyContent="space-between" alignItems="center" pb={2}>
      <Grid item>
        <Typography variant="h4">{getLabel(label, t)}</Typography>  
      </Grid>
      <Grid item>
        <IconButton onClick={() => setDialogOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default DialogHeader
