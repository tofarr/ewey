import DeleteIcon from '@mui/icons-material/Delete';
import MoreIcon from '@mui/icons-material/More';
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import EweyProps from "../../../eweyField/EweyProps";
import Result from "../../Result";
import { Link, useNavigate } from 'react-router-dom';
import DeleteDialog from '../DeleteDialog';
import { isLocked } from '../../../oauth/utils';
import { useOAuthBearerToken } from '../../../oauth/OAuthBearerTokenProvider';
import LockableLink from '../LockableLink';
import usePersistyDataOperations from '../../PersistyDataOperationsProvider';


export function DataActionField({ value }: EweyProps<Result>) {
  const { fileDeleteOp } = usePersistyDataOperations()
  const navigate = useNavigate()
  const token = useOAuthBearerToken()

  return (
    <Grid container direction="row" spacing={1} justifyContent="flex-end">
      <Grid item>
        <Link to={`?key=${encodeURIComponent(value.key)}`}>
          <IconButton>
            <MoreIcon />
          </IconButton>
        </Link>
      </Grid>
      {fileDeleteOp &&
        <Grid item>
          <DeleteDialog deleteOp={fileDeleteOp} result={value} onDelete={() => navigate("")}>
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
