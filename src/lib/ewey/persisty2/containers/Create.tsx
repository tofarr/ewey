import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePersistyOperations from "../PersistyOperationsProvider";
import { getLabel } from "../../label";
import { useTranslation } from "react-i18next";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Result from "../Result";
import LockableLink from '../components/LockableLink';
import { isLocked } from '../../oauth/utils';
import { useOAuthBearerToken } from '../../oauth/OAuthBearerTokenProvider';
import DeleteDialog from '../components/DeleteDialog';
import CircularProgress from '@mui/material/CircularProgress';
import OpenApiForm from '../../openApi/OpenApiForm';
import { useMessageBroker } from '../../message/MessageBrokerContext';
import { OpenApiOperation } from '../../openApi/model/OpenApiOperation';


export default function Create() {
  const { searchOp, createOp } = usePersistyOperations()
  const { t } = useTranslation()
  const token = useOAuthBearerToken()
  const messageBroker = useMessageBroker()
  const navigate = useNavigate()

  function renderActions(){
    return (
      searchOp && 
      <Grid container>
        <Grid item>
          <LockableLink
            to=""
            locked={isLocked(searchOp as OpenApiOperation, token)}
          >
            <Fab>
              <CloseIcon />
            </Fab>
          </LockableLink>
        </Grid>
      </Grid>
    )
  }

  if (!createOp || isLocked(createOp, token)) {
    return <ErrorComponent />
  }

  return (
    <OpenApiForm
      operationId={createOp.operationId}
      cancelElement={renderActions()}
      onSuccess={() => {
        messageBroker.triggerMessage(getLabel("create_successful", t));
        if (searchOp) {
          navigate("")
        }
      }}
      onError={(error: any) => {
        messageBroker.triggerError(error);
      }}
    />
  )
}