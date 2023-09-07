import Grid from "@mui/material/Grid"
import CrudPaginator from "./CrudPaginator";
import { CrudParams } from "./CrudParams";
import CrudCount from "./CrudCount";
import CrudFilters from "./CrudFilters";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { CrudCreateButton } from "./CrudCreateButton";

export interface CrudHeaderProps {
  store: string
  params: CrudParams
  onSetParams: (params: CrudParams) => void
  nextPageKey?: string | null
}

const CrudHeader = ({ store, nextPageKey, params, onSetParams }: CrudHeaderProps) => {
  const openApi = useOpenApi()
  const createOperation = openApi.operations.find(op => op.operationId === `${store}_create`)

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
        <CrudFilters store={store} params={params} onSetParams={onSetParams} />
      </Grid>
      <Grid item xs>
        {createOperation && (
          <CrudCreateButton
            searchOperationName={`${store}_search`}
            createOperation={createOperation}
          />
        )}
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
