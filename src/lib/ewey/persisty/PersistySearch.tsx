import { Fragment, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import PersistyHeader from "./PersistyHeader"
import Paper from "@mui/material/Paper"
import { PersistyParams } from "./PersistyParams"
import { jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley"
import { JsonObjectType } from "../eweyField/JsonType"
import EweyFactory from "../eweyFactory/EweyFactory"
import { AnySchemaObject } from "../schemaCompiler"
import { ComponentSchemas } from "../ComponentSchemas"
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory"
import FieldSetWrapper from "../eweyField/FieldSetWrapper"
import { EweyFactoryProvider, useEweyFactories } from "../providers/EweyFactoryProvider"
import OpenApiQuery from "../openApi/OpenApiQuery"
import OpenApiContent from "../openApi/OpenApiContent"
import TableFactory from "../eweyFactory/TableFactory"
import { useOpenApi } from "../openApi/OpenApiProvider"
import { persistyActionsWrapper } from "./PersistyActions"

export interface PersistySearchProps {
  store: string,
  limit?: number,
  keyFactory?: (item: JsonObjectType) => string,
}

const PersistySearch = ({ store, limit, keyFactory }: PersistySearchProps) => {
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
    setQueryParams(newQueryParams as any)
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
                <PersistyHeader 
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

export class ResultSetFactory implements EweyFactory {
  priority: number = 200;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (schema.type === "object" && (schema.name || '').endsWith('ResultSet') && schema.properties.results) {
      const resultsSchema = schema.properties.results
      const fieldsByKey = {
        results: JsonSchemaFieldFactory(resultsSchema, components, ["results"], factories)
      }
      const result = FieldSetWrapper(fieldsByKey, true, [], [], {})
      return result
    }
    return null
  }
}

export default PersistySearch
