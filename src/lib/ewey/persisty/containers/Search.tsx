import { Fragment } from "react";
import Box from "@mui/material/Box";
import usePersistyOperations from "../PersistyOperationsProvider";
import { JsonObjType } from "json-urley";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import Header from "../components/search/Header";
import OpenApiContent from "../../openApi/OpenApiContent";
import { OpenApiOperation } from "../../openApi/model/OpenApiOperation";
import pick from 'lodash/pick';
import useQueryParams from "../components/useQueryParams";
import ResultSet from "../ResultSet";

export interface SearchProps {
  limit?: number,
}

export interface SearchParams {
  search_filter?: JsonObjType
  search_order?: JsonObjType
  page_key?: string
  limit?: number
}

export default function Search({ limit }: SearchProps) {
  const { countOp, searchOp } = usePersistyOperations()
  const [params, setParams] = useQueryParams<SearchParams>((newParams) => {
    const result = pick(newParams, ["search_filter", "searchOrder", "page_key", "limit"])
    result["limit"] = newParams.limit || limit || 5
    return result
  })
  const [countParams] = useQueryParams<JsonObjType>(newParams => pick(newParams, ["search_filter"]))
  
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
                  nextPageKey={(resultSet as unknown as ResultSet).next_page_key}
                  creatable={(resultSet as unknown as ResultSet).creatable}
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