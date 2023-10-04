import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import usePersistyOperations from "../PersistyOperationsProvider";
import { getLabel } from "../../label";
import { useTranslation } from "react-i18next";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Result from "../ewey/Result";
import LockableLink from '../components/LockableLink';
import { isLocked } from '../../oauth/utils';
import { useOAuthBearerToken } from '../../oauth/OAuthBearerTokenProvider';
import { PersistyDeleteDialog } from '../components/PersistyDeleteDialog';
import CircularProgress from '@mui/material/CircularProgress';
import OpenApiContent from '../../openApi/OpenApiContent';


export default function Read() {
  const [queryParams] = useSearchParams();
  const key = queryParams.get("key")
  const { storeName, readOp, updateOp, deleteOp, searchOp } = usePersistyOperations()
  const { t } = useTranslation()
  const token = useOAuthBearerToken()
  const navigate = useNavigate()

  function renderHeader(){
    return (
      <Grid item>
        <Typography variant="h4">{getLabel(storeName, t)}</Typography>  
      </Grid>
    )
  }

  function renderActions(result: Result){
    return (
      <Grid item>
        <Grid container justifyContent="flex-end">
          {searchOp &&
            <Grid item>
              <Link to="">
                <Fab>
                  <CloseIcon />
                </Fab>
              </Link>
            </Grid>
          }
          {updateOp && 
            <Grid item>
              <LockableLink
                to={`?key=${encodeURIComponent(result.key)}&edit=true`}
                locked={isLocked(updateOp, token)}
              >
                <Fab>
                  <EditIcon />
                </Fab>
              </LockableLink>
            </Grid>
          }
          {deleteOp &&
            <Grid item>
              <PersistyDeleteDialog result={result} storeName={storeName} onDelete={() => navigate("")}>
                {(isLoading, disabled, setDialogOpen) => (
                  <Fab onClick={() => setDialogOpen(true)}>
                    {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </Fab>
                )}
              </PersistyDeleteDialog>
            </Grid>
          }
        </Grid>
      </Grid>
    )
  }

  if (!readOp) {
    return <ErrorComponent />
  }

  return (
    <OpenApiQuery
        operationId={readOp.operationId}
        params={{key}}
      >
      {value => (
        <Grid container spacing={2}>
          {renderHeader()}
          <Grid item>
            <OpenApiContent operationId={readOp.operationId} value={value} />
          </Grid>
          {renderActions(value as unknown as Result)}
        </Grid>
      )}
    </OpenApiQuery>
  )
}