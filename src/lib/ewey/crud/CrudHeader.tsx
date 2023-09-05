import Grid from "@mui/material/Grid"
import CrudPaginator from "./CrudPaginator";
import { CrudParams } from "./CrudParams";
import CrudCount from "./CrudCount";
import CrudFilters from "./CrudFilters";

export interface CrudHeaderProps {
  store: string
  params: CrudParams
  onSetParams: (params: CrudParams) => void
  nextPageKey?: string | null
}

const CrudHeader = ({ store, nextPageKey, params, onSetParams }: CrudHeaderProps) => {
  console.log("TRACE:CrudHeader")

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
    onSetParams({ ...params, limit })
  }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item xs>
        <CrudFilters store={store} params={params} onSetParams={onSetParams} />
      </Grid>
      <Grid item xs>
        <CrudCount store={store} params={params} />
      </Grid>
      <Grid item>
        <CrudPaginator
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

export default CrudHeader;
