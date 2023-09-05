import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import CrudHeader from "./CrudHeader"
import Paper from "@mui/material/Paper"
import OpenApiQuery from "../openApi/OpenApiQuery"
import { CrudParams } from "./CrudParams"
import { jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley"
import { JsonObjectType } from "../eweyField/JsonType"

export interface CrudSearchProps {
  store: string,
  limit?: number
}

const CrudSearch = ({ store, limit }: CrudSearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<CrudParams>(queryParamsToJsonObj(queryParams))

  function handleSetParams(newParams: CrudParams){
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setQueryParams(newQueryParams)
    setParams(newParams)
  }

  return (
    <Paper>
      <Box padding={1}>
        <CrudHeader key="header" store={store} params={params} onSetParams={handleSetParams} />
        <OpenApiQuery operationId={`${store}_search`} params={params} />
      </Box>
    </Paper>
  )
}

export default CrudSearch
