import { Fragment } from "react";
import Box from "@mui/material/Box";
import usePersistyDataOperations from "../PersistyDataOperationsProvider";
import { JsonObjType } from "json-urley";
import OpenApiQuery from "../../openApi/OpenApiQuery";
import ErrorComponent from "../../component/ErrorComponent";
import DataHeader from "../components/data/DataHeader";
import OpenApiContent from "../../openApi/OpenApiContent";
import { OpenApiOperation } from "../../openApi/model/OpenApiOperation";
import pick from 'lodash/pick';
import useQueryParams from "../components/useQueryParams";
import { SearchParams } from "./Search";

export interface DataSearchProps {
  limit?: number
}

export default function DataSearch({ limit }: DataSearchProps) {
  const { fileCountOp, fileSearchOp } = usePersistyDataOperations()
  const [params, setParams] = useQueryParams<SearchParams>((newParams) => {
    const result = pick(newParams, ["search_filter", "searchOrder", "page_key", "limit"])
    result["limit"] = newParams.limit || limit || 5
    return result
  })
  const [countParams] = useQueryParams<JsonObjType>(newParams => pick(newParams, ["search_filter"]))
  
  if (!fileSearchOp) {
    return <ErrorComponent />
  }

  return (
    <Box padding={1}>
      <OpenApiQuery 
        operationId={(fileCountOp as OpenApiOperation).operationId} 
        params={countParams}
      >
        {(count) => (
          <OpenApiQuery operationId={fileSearchOp.operationId} params={params}>
            {(resultSet) => (
              <Fragment>
                <DataHeader 
                  params={params} 
                  onSetParams={setParams} 
                  nextPageKey={(resultSet as JsonObjType).next_page_key as string}
                  count={count as number}
                />
                <OpenApiContent operationId={fileSearchOp.operationId} value={resultSet} />
              </Fragment>
            )}
          </OpenApiQuery>
        )}
      </OpenApiQuery>
    </Box>
  )
}