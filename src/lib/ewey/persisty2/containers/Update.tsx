import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
import { Link, useNavigate } from "react-router-dom";
import { pick } from 'lodash';
import usePersistyOperations from "../PersistyOperationsProvider";
import { getLabel } from "../../label";
import { useTranslation } from "react-i18next";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Result from "../Result";
import { isLocked } from '../../oauth/utils';
import { useOAuthBearerToken } from '../../oauth/OAuthBearerTokenProvider';
import DeleteDialog from '../components/DeleteDialog';
import CircularProgress from '@mui/material/CircularProgress';
import OpenApiForm from '../../openApi/OpenApiForm';
import { resolveRef } from '../../ComponentSchemas';
import { useMessageBroker } from '../../message/MessageBrokerContext';
import { JsonObjectType } from '../../eweyField/JsonType';
import { useQueryClient } from '@tanstack/react-query';
import useQueryParams from '../components/useQueryParams';
import { ReadParams } from './Read';

export default function Update() {
  const { key } = useQueryParams<ReadParams>(newParams => pick(newParams, ["key"]))[0]
  const { countOp, deleteOp, readOp, searchOp, updateOp } = usePersistyOperations()
  const { t } = useTranslation()
  const token = useOAuthBearerToken()
  const messageBroker = useMessageBroker()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
          <Link to={`?key=${encodeURIComponent(result.key)}`}>
            <Fab title={getLabel("cancel", t)}>
              <CloseIcon />
            </Fab>
          </Link>
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
      )}
    </OpenApiQuery>
  )
}
