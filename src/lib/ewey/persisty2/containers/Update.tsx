import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
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
import { resolveRef } from '../../ComponentSchemas';
import { useMessageBroker } from '../../message/MessageBrokerContext';
import { OpenApiOperation } from '../../openApi/model/OpenApiOperation';
import { JsonObjectType } from '../../eweyField/JsonType';


export default function Update() {
  const [queryParams] = useSearchParams();
  const key = queryParams.get("key")
  const { readOp, updateOp, deleteOp, searchOp } = usePersistyOperations()
  const { t } = useTranslation()
  const token = useOAuthBearerToken()
  const messageBroker = useMessageBroker()
  const navigate = useNavigate()

  function createInitialValues(readResult: Result){
    if (!updateOp){
      throw new Error('illegal_state')
    }
    const { paramsSchema } = updateOp
    const properties = resolveRef(paramsSchema.properties.item, paramsSchema.components).properties
    const readItem = readResult.item
    const item: JsonObjectType = {}
    for (const key in readItem){
      if (properties[key]){
        item[key] = readItem[key]
      }
    }
    return {item, key: readResult.key}
  }

  function renderActions(result: Result){
    return (
      <Grid container spacing={2}>
        <Grid item>
          <LockableLink
            to={`?key=${encodeURIComponent(result.key)}`}
            locked={isLocked(updateOp as OpenApiOperation, token)}
          >
            <Fab title={getLabel("cancel", t)}>
              <CloseIcon />
            </Fab>
          </LockableLink>
        </Grid>
        {deleteOp &&
          <Grid item>
            <DeleteDialog deleteOp={deleteOp} result={result} onDelete={() => navigate("")}>
              {(isLoading, disabled, setDialogOpen) => (
                <Fab title={getLabel("delete_item", t)} onClick={() => setDialogOpen(true)} disabled={disabled}>
                  {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
                </Fab>
              )}
            </DeleteDialog>
          </Grid>
        }
      </Grid>
    )
  }

  if (!readOp || !updateOp || isLocked(readOp, token) || isLocked(updateOp, token)) {
    return <ErrorComponent />
  }

  return (
    <OpenApiQuery
      operationId={readOp.operationId}
      params={{key}}
    >
      {value => (
        <OpenApiForm
          operationId={updateOp.operationId}
          value={createInitialValues(value as unknown as Result)}
          cancelElement={renderActions(value as unknown as Result)}
          onSuccess={() => {
            messageBroker.triggerMessage(getLabel("update_successful", t));
            if (searchOp) {
              navigate("")
            }
          }}
          onError={(error: any) => {
            messageBroker.triggerError(error);
          }}
        />
      )}
    </OpenApiQuery>
  )
}
