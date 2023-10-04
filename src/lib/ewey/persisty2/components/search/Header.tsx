import AddIcon from '@mui/icons-material/Add';
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import { SearchParams } from "../../containers/Search"
import usePersistyOperations from "../../PersistyOperationsProvider"
import Count from "./Count"
import Paginator from "./Paginator"
import LockableLink from "../LockableLink"
import { isLocked } from '../../../oauth/utils';
import { useOAuthBearerToken } from '../../../oauth/OAuthBearerTokenProvider';
import Filter from './Filter';


export interface HeaderProps {
  params: SearchParams
  onSetParams: (params: SearchParams) => void
  nextPageKey?: string | null
}

export default function Header({ nextPageKey, params, onSetParams }: HeaderProps) {
  const { createOp } = usePersistyOperations()
  const token = useOAuthBearerToken()

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
        <Count params={params} />
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
