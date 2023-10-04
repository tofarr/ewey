import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import usePersistyOperations from "../PersistyOperationsProvider";
import { JsonObjectType } from "../../eweyField/JsonType";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Header from "../components/search/Header";
import OpenApiContent from "../../openApi/OpenApiContent";

export interface SearchProps {
  limit?: number,
}

export interface SearchParams {
  search_filter?: JsonObjectType
  search_order?: JsonObjectType
  page_key?: string
  limit?: number
}

export default function Search({ limit }: SearchProps) {
  const { storeName, searchOp } = usePersistyOperations()
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<SearchParams>(generateParams)
  
  useEffect(() => {
    let newParams = generateParams();
    setParams(newParams)
  }, [storeName, queryParams])

  function generateParams() {
    const newParams: JsonObjectType = queryParamsToJsonObj(queryParams)
    if (newParams.limit == null) {
      newParams.limit = limit || 5
    }
    return newParams 
  }

  function handleSetParams(newParams: SearchParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams as any)
    setParams(newParams)
  }

  if (!searchOp) {
    return <ErrorComponent />
  }

  return (
    <Paper>
      <Box padding={1}>
        <OpenApiQuery operationId={searchOp.operationId} params={params}>
          {(resultSet) => (
            <Fragment>
              <Header 
                params={params} 
                onSetParams={handleSetParams} 
                nextPageKey={(resultSet as JsonObjectType).next_page_key as string}
              />
              <OpenApiContent operationId={searchOp.operationId} value={resultSet} />
            </Fragment>
          )}
        </OpenApiQuery>
      </Box>
    </Paper>
  )
}