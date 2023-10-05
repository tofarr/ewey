import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import usePersistyOperations from "../PersistyOperationsProvider";
import { getLabel } from "../../label";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../component/ErrorComponent";
import LockableLink from '../components/LockableLink';
import { isLocked } from '../../oauth/utils';
import { useOAuthBearerToken } from '../../oauth/OAuthBearerTokenProvider';
import OpenApiForm from '../../openApi/OpenApiForm';
import { useMessageBroker } from '../../message/MessageBrokerContext';
import { OpenApiOperation } from '../../openApi/model/OpenApiOperation';
import { useQueryClient } from '@tanstack/react-query';
import HeightAnimator from '../../component/HeightAnimator';


export default function Create() {
  const { searchOp, countOp, createOp, readOp } = usePersistyOperations()
  const { t } = useTranslation()
  const token = useOAuthBearerToken()
  const messageBroker = useMessageBroker()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    <HeightAnimator>
      <OpenApiForm
        operationId={createOp.operationId}
        cancelElement={renderActions()}
        onSuccess={() => {
          messageBroker.triggerMessage(getLabel("create_successful", t));
          for (const op of [countOp, readOp, searchOp]){
            queryClient.invalidateQueries([op?.operationId], { exact: false });
          }
          if (searchOp) {
            navigate("")
          }
        }}
        onError={(error: any) => {
          messageBroker.triggerError(error);
        }}
      />
    </HeightAnimator>
  )
}