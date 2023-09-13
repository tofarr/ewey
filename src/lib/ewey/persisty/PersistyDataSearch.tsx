import { Fragment, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { PersistyParams } from "./PersistyParams"
import { jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley"
import { JsonObjectType } from "../eweyField/JsonType"
import { EweyFactoryProvider, useEweyFactories } from "../providers/EweyFactoryProvider"
import OpenApiQuery from "../openApi/OpenApiQuery"
import OpenApiContent from "../openApi/OpenApiContent"
import TableFactory from "../eweyFactory/TableFactory"
import { useOpenApi } from "../openApi/OpenApiProvider"
import { persistyActionsWrapper } from "./PersistyActions"
import { ResultSetFactory } from "./PersistySearch"
import PersistyDataHeader from "./PersistyDataHeader"

export interface PersistyDataSearchProps {
  store: string,
  limit?: number,
  keyFactory?: (item: JsonObjectType) => string,
}

const PersistyDataSearch = ({ store, limit, keyFactory }: PersistyDataSearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<PersistyParams>(() => {
    const initialParams: JsonObjectType = queryParamsToJsonObj(queryParams)
    if (initialParams.limit == null) {
      initialParams.limit = limit || 5
    }
    return initialParams
  })
  const factories = useEweyFactories()
  const openApi = useOpenApi();

  function handleSetParams(newParams: PersistyParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams)
    setParams(newParams)
  }
  
  const updateOperation = openApi.operations.find(op => op.operationId === `${store}_update`)
  const deleteOperation = openApi.operations.find(op => op.operationId === `${store}_delete`)

  const searchFieldFactories = [
    ...factories,
    new ResultSetFactory()
  ]
  if (updateOperation || deleteOperation) {
    const persistyActions = persistyActionsWrapper(`${store}_search`, updateOperation, deleteOperation, keyFactory)
    searchFieldFactories.push(new TableFactory(300, null, ["results"], persistyActions))
  }
  return (
    <Paper>
      <Box padding={1}>
        <EweyFactoryProvider factories={searchFieldFactories}>
          <OpenApiQuery operationId={`${store}_search`} params={params}>
            {(resultSet) => (
              <Fragment>
                <PersistyDataHeader 
                  store={store} 
                  params={params} 
                  onSetParams={handleSetParams} 
                  nextPageKey={(resultSet as JsonObjectType).next_page_key as string}
                />
                <OpenApiContent operationId={`${store}_search`} value={resultSet} />
              </Fragment>
            )}
          </OpenApiQuery>
        </EweyFactoryProvider>
      </Box>
    </Paper>
  )
}

export default PersistyDataSearch
