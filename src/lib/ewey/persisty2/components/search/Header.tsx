import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Typography from '@mui/material/Typography';
import { SearchParams } from "../../containers/Search"
import usePersistyOperations from "../../PersistyOperationsProvider"
import Paginator from "./Paginator"
import LockableLink from "../LockableLink"
import { isLocked } from '../../../oauth/utils';
import { useOAuthBearerToken } from '../../../oauth/OAuthBearerTokenProvider';
import Filter from './Filter';
import { getLabel } from '../../../label';

export interface HeaderProps {
  params: SearchParams
  onSetParams: (params: SearchParams) => void
  nextPageKey?: string | null
  count?: number
}

export default function Header({ nextPageKey, params, onSetParams, count }: HeaderProps) {
  const { createOp } = usePersistyOperations()
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
        <Filter params={params} onSetParams={onSetParams} />
      </Grid>
      <Grid item xs>
        {createOp && (
          <LockableLink to="?edit=true" locked={isLocked(createOp, token)}>
            <IconButton >
              <AddIcon />
            </IconButton>
          </LockableLink>
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
