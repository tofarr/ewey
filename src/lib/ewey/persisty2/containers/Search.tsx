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
import CircularProgress from "@mui/material/CircularProgress";
import { OpenApiOperation } from "../../openApi/model/OpenApiOperation";
import pick from 'lodash/pick';
import useQueryParams from "../components/useQueryParams";

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
  const { storeName, countOp, searchOp } = usePersistyOperations()
  // const [queryParams, setQueryParams] = useSearchParams();
  // const [params, setParams] = useState<SearchParams>(generateParams)
  const [params, setParams] = useQueryParams<SearchParams>((newParams) => {
    const result = pick(newParams, ["search_filter", "searchOrder", "page_key", "limit"])
    result["limit"] = newParams.limit || limit || 5
    return result
  })
  const [countParams] = useQueryParams<JsonObjectType>(newParams => pick(newParams, ["search_filter"]))
  /*
  useEffect(() => {
    let newParams = generateParams();
    setParams(newParams)
  }, [storeName, queryParams])

  const countParams: JsonObjectType = {}
  if (params.search_filter) {
    countParams.search_filter = params.search_filter
  }

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
  */

  if (!searchOp) {
    return <ErrorComponent />
  }

  return (
    <Box padding={1}>
      <OpenApiQuery 
        operationId={(countOp as OpenApiOperation).operationId} 
        params={countParams}
      >
        {(count) => (
          <OpenApiQuery operationId={searchOp.operationId} params={params}>
            {(resultSet) => (
              <Fragment>
                <Header 
                  params={params} 
                  onSetParams={setParams} 
                  nextPageKey={(resultSet as JsonObjectType).next_page_key as string}
                  count={count as number}
                />
                <OpenApiContent operationId={searchOp.operationId} value={resultSet} />
              </Fragment>
            )}
          </OpenApiQuery>
        )}
      </OpenApiQuery>
    </Box>
  )
}