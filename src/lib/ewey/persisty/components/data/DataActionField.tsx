import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
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
import DataDeleteDialog from './DataDeleteDialog';


export function DataActionField({ value }: EweyProps<Result>) {
  const { fileDeleteOp, baseUrl } = usePersistyDataOperations()
  const navigate = useNavigate()
  const token = useOAuthBearerToken()
  let downloadUrl = value.item.download_url as string
  if (!downloadUrl.startsWith("http")){
    downloadUrl = baseUrl + downloadUrl;
  }

  return (
    <Grid container direction="row" spacing={1} justifyContent="flex-end">
      <Grid item>
        <Link target="_blank" to={downloadUrl}>
          <IconButton>
            <LinkIcon />
          </IconButton>
        </Link>
      </Grid>
      {fileDeleteOp &&
        <Grid item>
          <DataDeleteDialog result={value} onDelete={() => navigate("")}>
            {(isLoading, disabled, setDialogOpen) => (
             <IconButton 
                disabled={disabled} 
                onClick={() => setDialogOpen(true)}
              >
                {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            )}
          </DataDeleteDialog>
        </Grid>
      }
    </Grid>
  )
}
