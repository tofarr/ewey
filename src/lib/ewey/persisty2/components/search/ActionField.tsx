import DeleteIcon from '@mui/icons-material/Delete';
import MoreIcon from '@mui/icons-material/More';
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import EweyProps from "../../../eweyField/EweyProps";
import Result from "../../Result";
import usePersistyOperations from "../../PersistyOperationsProvider";
import { useNavigate } from 'react-router-dom';
import DeleteDialog from '../DeleteDialog';
import { isLocked } from '../../../oauth/utils';
import { useOAuthBearerToken } from '../../../oauth/OAuthBearerTokenProvider';
import LockableLink from '../LockableLink';



export function ActionField({ value, onSetValue }: EweyProps<Result>) {
  const { deleteOp, readOp } = usePersistyOperations()
  const navigate = useNavigate()
  const token = useOAuthBearerToken()

  return (
    <Grid container direction="row" spacing={1} justifyContent="flex-end">
      {readOp && 
        <Grid item>
          <LockableLink
            to={`?key=${encodeURIComponent(value.key)}`}
            locked={isLocked(readOp, token)}
          >
            <IconButton>
              <MoreIcon />
            </IconButton>
          </LockableLink>
        </Grid>
      }
      {deleteOp &&
        <Grid item>
          <DeleteDialog deleteOp={deleteOp} result={value} onDelete={() => navigate("")}>
            {(isLoading, disabled, setDialogOpen) => (
             <IconButton 
                disabled={disabled} 
                onClick={() => setDialogOpen(true)}
              >
                {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            )}
          </DeleteDialog>
        </Grid>
      }
    </Grid>
  )
}
