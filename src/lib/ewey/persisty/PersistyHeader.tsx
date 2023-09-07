import Grid from "@mui/material/Grid"
import PersistyPaginator from "./PersistyPaginator";
import { PersistyParams } from "./PersistyParams";
import PersistyCount from "./PersistyCount";
import PersistyFilters from "./PersistyFilters";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { PersistyCreateButton } from "./PersistyCreateButton";

export interface PersistyHeaderProps {
  store: string
  params: PersistyParams
  onSetParams: (params: PersistyParams) => void
  nextPageKey?: string | null
}

const PersistyHeader = ({ store, nextPageKey, params, onSetParams }: PersistyHeaderProps) => {
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
        <PersistyFilters store={store} params={params} onSetParams={onSetParams} />
      </Grid>
      <Grid item xs>
        {createOperation && (
          <PersistyCreateButton
            searchOperationName={`${store}_search`}
            createOperation={createOperation}
          />
        )}
      </Grid>
      <Grid item xs>
        <PersistyCount store={store} params={params} />
      </Grid>
      <Grid item>
        <PersistyPaginator
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

export default PersistyHeader;
