/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useState } from "react"
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
// import { persistyActionsWrapper } from "./PersistyActions"
// import PersistyImgRefFactory from "./PersistyImgRefFactory"
import PersistyItem from "./PersistyItem"
import PersistyResultSetFactory from "./PersistyResultSetFactory"


export interface PersistySearchProps {
  store: string,
  limit?: number,
}

const PersistySearch = ({ store, limit }: PersistySearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<PersistyParams>(generateParams)
  const key = queryParams.get("key")
  const edit = !!queryParams.get("edit")
  const factories = useEweyFactories()
  const openApi = useOpenApi();

  useEffect(() => {
    let newParams = generateParams();
    setParams(newParams)
  }, [store, queryParams])

  function generateParams() {
    const newParams: JsonObjectType = queryParamsToJsonObj(queryParams)
    if (newParams.limit == null) {
      newParams.limit = limit || 5
    }
    return newParams 
  }
  
  function handleSetParams(newParams: PersistyParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams as any)
    setParams(newParams)
  }
  
  const readOperation = openApi.operations.find(op => op.operationId === `${store}_read`)
  const deleteOperation = openApi.operations.find(op => op.operationId === `${store}_delete`)

  const searchFieldFactories = [
    ...factories,
    new PersistyResultSetFactory()
    // new ResultSetFactory(),
    // new PersistyImgRefFactory()
  ]

  //const persistyActions = persistyActionsWrapper(`${store}_search`, readOperation, deleteOperation)
  //searchFieldFactories.push(new TableFactory(300, null, ["results"], persistyActions))

  function renderContent(){
    if (key){
      return <PersistyItem store={store} itemKey={key} edit={edit} />
    }
    return (
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
    )
  }

  return (
    <Paper>
      <Box padding={1}>
        <EweyFactoryProvider factories={searchFieldFactories}>
          {renderContent()}
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
