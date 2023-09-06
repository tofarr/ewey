import { Fragment, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import CrudHeader from "./CrudHeader"
import Paper from "@mui/material/Paper"
import { CrudParams } from "./CrudParams"
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
import { Button } from "@mui/material"
import EweyField from "../eweyField/EweyField"
import { useOpenApi } from "../openApi/OpenApiProvider"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import { crudActionsWrapper } from "./CrudActions"

export interface CrudSearchProps {
  store: string,
  limit?: number
}

const CrudSearch = ({ store, limit }: CrudSearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<CrudParams>(() => {
    const initialParams: JsonObjectType = queryParamsToJsonObj(queryParams)
    if (initialParams.limit == null) {
      initialParams.limit = limit || 5
    }
    return initialParams
  })
  const factories = useEweyFactories()
  const openApi = useOpenApi();

  function handleSetParams(newParams: CrudParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams)
    setParams(newParams)
  }

  //const createOperation = openApi.operations.find(op => op.operationId === `${store}_create`)
  const updateOperation = openApi.operations.find(op => op.operationId === `${store}_update`)
  const deleteOperation = openApi.operations.find(op => op.operationId === `${store}_delete`)

  const searchFieldFactories = [
    ...factories,
    new ResultSetFactory()
  ]
  if (updateOperation || deleteOperation) {
    const crudActions = crudActionsWrapper(`${store}_search`, updateOperation, deleteOperation)
    searchFieldFactories.push(new TableFactory(300, null, ["results"], crudActions))
  }
  return (
    <Paper>
      <Box padding={1}>
        <EweyFactoryProvider factories={searchFieldFactories}>
          <OpenApiQuery operationId={`${store}_search`} params={params}>
            {(resultSet) => (
              <Fragment>
                <CrudHeader 
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

class ResultSetFactory implements EweyFactory {
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

export default CrudSearch
