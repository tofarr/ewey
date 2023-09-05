import { useState } from "react"
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
import OpenApiQueryContent from "../openApi/OpenApiQueryContent"

export interface CrudSearchProps {
  store: string,
  limit?: number
}

const CrudSearch = ({ store, limit }: CrudSearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<CrudParams>(queryParamsToJsonObj(queryParams))
  const factories = useEweyFactories()

  function handleSetParams(newParams: CrudParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams)
    setParams(newParams)
  }

  return (
    <Paper>
      <Box padding={1}>
        <CrudHeader key="header" store={store} params={params} onSetParams={handleSetParams} />
        <EweyFactoryProvider factories={[...factories,  new ResultSetFactory()]}>
          <OpenApiQueryContent operationId={`${store}_search`} params={params} />
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
        results: JsonSchemaFieldFactory(resultsSchema, components, currentPath, factories)
      }
      const result = FieldSetWrapper(fieldsByKey, true, [], [], {})
      return result
    }
    return null
  }
}

export default CrudSearch
