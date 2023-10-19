import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import pick from 'lodash/pick';
import usePersistyOperations from "../PersistyOperationsProvider";
import { getLabel } from "../../label";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Result from "../Result";
import LockableLink from '../components/LockableLink';
import { isLocked } from '../../oauth/utils';
import { useOAuthBearerToken } from '../../oauth/OAuthBearerTokenProvider';
import DeleteDialog from '../components/DeleteDialog';
import CircularProgress from '@mui/material/CircularProgress';
import OpenApiContent from '../../openApi/OpenApiContent';
import useQueryParams from '../components/useQueryParams';
import { useState } from 'react';

export interface ReadParams {
  key: string
}

export default function Read() {
  const { key } = useQueryParams<ReadParams>(newParams => pick(newParams, ["key"]))[0]
  const { storeName, readOp, updateOp, deleteOp, searchOp } = usePersistyOperations()
  const [prevStoreName] = useState(storeName)
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
    if (!result){
      return null
    }
    const updateDisabled = !!updateOp && (isLocked(updateOp, token) || !result.updatable)
    return (
      <Grid item xs>
        <Grid container justifyContent="flex-end" spacing={2}>
          {searchOp &&
            <Grid item>
              <Link to="">
                <Fab title={getLabel("cancel", t)}>
                  <CloseIcon />
                </Fab>
              </Link>
            </Grid>
          }
          {updateOp && 
            <Grid item>
              <LockableLink
                to={`?key=${encodeURIComponent(result.key)}&edit=true`}
                locked={updateDisabled}
              >
                <Fab disabled={updateDisabled} title={getLabel("update_item", t)}>
                  <EditIcon />
                </Fab>
              </LockableLink>
            </Grid>
          }
          {deleteOp &&
            <Grid item>
              <DeleteDialog result={result} onDelete={() => navigate("")}>
                {(isLoading, disabled, setDialogOpen) => (
                  <Fab title={getLabel("delete_item", t)} onClick={() => setDialogOpen(true)} disabled={disabled}>
                    {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </Fab>
                )}
              </DeleteDialog>
            </Grid>
          }
        </Grid>
      </Grid>
    )
  }

  if (prevStoreName != storeName){
    // Catch case where user navigates to different store. Wait for the router to catch up
    return null
  }

  if (!readOp || isLocked(readOp, token)) {
    return <ErrorComponent />
  }

  return (
    <Box padding={2}>
      <OpenApiQuery
          operationId={readOp.operationId}
          params={{key}}
        >
        {value => (
          <Grid container spacing={2} direction="column">
            {renderHeader()}
            <Grid item>
              <OpenApiContent operationId={readOp.operationId} value={value} />
            </Grid>
            {renderActions(value as unknown as Result)}
          </Grid>
        )}
      </OpenApiQuery>
    </Box>
  )
}
