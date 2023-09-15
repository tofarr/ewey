import { Fragment, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import LinkIcon from '@mui/icons-material/Link';
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import { PersistyParams } from "./PersistyParams"
import { jsonObjToQueryParams, jsonObjToQueryStr, queryParamsToJsonObj } from "json-urley"
import { JsonObjectType } from "../eweyField/JsonType"
import { EweyFactoryProvider, useEweyFactories } from "../providers/EweyFactoryProvider"
import OpenApiQuery from "../openApi/OpenApiQuery"
import TableFactory from "../eweyFactory/TableFactory"
import { useOpenApi } from "../openApi/OpenApiProvider"
import { persistyActionsWrapper } from "./PersistyActions"
import { ResultSetFactory } from "./PersistySearch"
import PersistyDataHeader from "./PersistyDataHeader"
import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useTranslation } from "react-i18next"
import { getLabel } from "../label"
import { PersistyDeleteButton } from "./PersistyDeleteButton"
import PersistyImg from "./PersistyImg"

export interface PersistyDataSearchProps {
  store: string,
  limit?: number,
  keyFactory?: (item: JsonObjectType) => string,
  imgWidth?: number
  imgHeight?: number
}

export interface PersistyDataItem {
  key: string
  content_type: string
  data_url: string
  size: number
  updated_at: string
}

export interface DataItemResultSet {
  next_page_key?: string | null
  results: PersistyDataItem[]
}

const BYTES = {name: "b", divisor: 1}
const UNITS = [
    {name: "Gb", divisor: Math.pow(1024, 3)},
    {name: "Mb", divisor: Math.pow(1024, 2)},
    {name: "kb", divisor: 1024},
]


const PersistyDataSearch = ({ store, limit, keyFactory, imgWidth = 64, imgHeight = 50 }: PersistyDataSearchProps) => {
  const [queryParams, setQueryParams] = useSearchParams();
  const [params, setParams] = useState<PersistyParams>(generateParams)
  const factories = useEweyFactories()
  const openApi = useOpenApi()
  const { t } = useTranslation()
  const deleteOperation = openApi.operations.find(op => op.operationId === `${store}_delete`)

  useEffect(() => {
    let newParams = generateParams();
    if (newParams.page_key != params.page_key || newParams.limit != params.limit){
      setParams(newParams)
    }
  }, [store])

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

  function renderSize(size: number) {
    let unit = UNITS.find(u => u.divisor / 2 <= size) || BYTES
    const sizeInUnits = size / unit.divisor
    return sizeInUnits.toLocaleString(navigator.language, {maximumFractionDigits: 1}) + unit.name
  }

  function renderContent(key: string, dataUrl: string, updatedAt?: string | null, contentType?: string | null) {
    if (contentType && contentType.toLowerCase().startsWith("image/")) {
      const queryStr = jsonObjToQueryStr({
        store_name: store,
        key,
        width: imgWidth,
        height: imgHeight,
      })
      const src = `${openApi.schema.servers[0].url}/resized-img?${queryStr}`;
      return (
        <PersistyImg src={src} updatedAt={updatedAt} width={imgWidth} height={imgHeight} />
      )
    }
    return (
      <Button variant="outlined">
        {key}
      </Button>
    )
  }

  function renderRow({ key, data_url, content_type, size, updated_at }: PersistyDataItem) {
    if (!data_url.startsWith('http:') && !data_url.startsWith('https:')){
      data_url = openApi.schema.servers[0].url + data_url
    }
    return (
      <TableRow key={key}>
        <TableCell>
          {renderContent(key, data_url, updated_at, content_type)}
        </TableCell>
        <TableCell align="right">{renderSize(size)}</TableCell>
        <TableCell>{new Date(updated_at).toLocaleString()}</TableCell>
        <TableCell>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item>
              <a href={data_url}>
                <IconButton>
                  <LinkIcon />
                </IconButton>
              </a>
            </Grid>
            {deleteOperation && 
              <Grid item>
                <PersistyDeleteButton
                  itemKey={key}
                  searchOperationName={`${store}_search`} 
                  deleteOperation={deleteOperation}
                />
              </Grid>
            }
          </Grid>
        </TableCell>
      </TableRow>
    )
  }
  
  const searchFieldFactories = [
    ...factories,
    new ResultSetFactory()
  ]
  if (deleteOperation) {
    const persistyActions = persistyActionsWrapper(`${store}_search`, undefined, deleteOperation, keyFactory)
    searchFieldFactories.push(new TableFactory(300, null, ["results"], persistyActions))
  }
  return (
    <Paper>
      <Box padding={1}>
        <EweyFactoryProvider factories={searchFieldFactories}>
          <OpenApiQuery operationId={`${store}_search`} params={params}>
            {(results) => {
              const resultSet = results as unknown as DataItemResultSet
              return (
                <Fragment>
                  <PersistyDataHeader 
                    store={store} 
                    params={params} 
                    onSetParams={handleSetParams} 
                    nextPageKey={resultSet.next_page_key}
                  />
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right">{getLabel('file_size', t)}</TableCell>
                        <TableCell>{getLabel('updated_at', t)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resultSet.results.map(renderRow)}
                    </TableBody>
                  </Table>
                </Fragment>
              )
            }}
          </OpenApiQuery>
        </EweyFactoryProvider>
      </Box>
    </Paper>
  )
}

export default PersistyDataSearch
