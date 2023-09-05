import { useState } from "react"
import Box from "@mui/material/Box"
import CrudHeader from "./CrudHeader"
import Paper from "@mui/material/Paper"
import OpenApiQuery from "../openApi/OpenApiQuery"
import { JsonObjType } from "json-urley"
import { CrudParams } from "./CrudParams"

export interface CrudSearchProps {
  store: string,
  limit?: number
}

const CrudSearch = ({ store, limit }: CrudSearchProps) => {
  const [params, setParams] = useState<CrudParams>({limit: limit || 5})

  return (
    <Paper>
      <Box padding={1}>
        <CrudHeader key="header" store={store} params={params} onSetParams={setParams} />
        <OpenApiQuery operationId={`${store}_search`} params={params} />
      </Box>
    </Paper>
  )
}

export default CrudSearch
