import { useTranslation } from 'react-i18next';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Typography from '@mui/material/Typography';
import { SearchParams } from "../../containers/Search"
import { useOAuthBearerToken } from '../../../oauth/OAuthBearerTokenProvider';
import { getLabel } from '../../../label';
import Paginator from '../search/Paginator';
import usePersistyDataOperations from '../../PersistyDataOperationsProvider';
import { Fragment, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { DialogContent } from '@mui/material';
import FileUploadForm from './FileUploadForm';
import Filter from '../search/Filter';
import { OpenApiOperation } from '../../../openApi/model/OpenApiOperation';

export interface DataHeaderProps {
  params: SearchParams
  onSetParams: (params: SearchParams) => void
  nextPageKey?: string | null
  count?: number
}

export default function DataHeader({ nextPageKey, params, onSetParams, count }: DataHeaderProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const { uploadCreateOp, fileSearchOp } = usePersistyDataOperations()
  const token = useOAuthBearerToken()
  const { t } = useTranslation()

  function handleSetPageKey(pageKey: string | null) {
    const newParams = { ...params }
    if (pageKey) {
      newParams.page_key = pageKey
    } else {
      delete newParams.page_key
    }
    onSetParams(newParams)
  }

  function handleSetLimit(limit: number) {
    const newParams = { ...params, limit }
    delete newParams.page_key
    onSetParams(newParams)
  }

  function renderLabel() {
    if (count === 0) {
      return getLabel('no_results', t)
    }
    const result = t('x_results', `${count} Results`, {x: count});
    return result
  }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Filter params={params} onSetParams={onSetParams} searchOp={fileSearchOp as OpenApiOperation} />
      </Grid>
      <Grid item xs>
        {uploadCreateOp && (
          <Fragment>
            <IconButton onClick={() => setShowUploadDialog(true)}>
              <UploadFileIcon />
            </IconButton>
            <Dialog
              open={showUploadDialog}
              onClose={() => setShowUploadDialog(false)}
              fullWidth
              maxWidth="lg"
            >
              <DialogContent>
                <FileUploadForm onFinishUpload={() => {
                  setShowUploadDialog(false)
                }} />
              </DialogContent>
            </Dialog>
          </Fragment>
        )}
      </Grid>
      <Grid item xs>
        <Typography variant="body2">{renderLabel()}</Typography>
      </Grid>
      <Grid item>
        <Paginator
          pageKey={params.page_key}
          nextPageKey={nextPageKey}
          onSetPageKey={handleSetPageKey}
          limit={params.limit}
          onSetLimit={handleSetLimit}
        />
      </Grid>
    </Grid>
  )
}
