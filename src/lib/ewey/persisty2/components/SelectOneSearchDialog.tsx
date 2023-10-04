
import { useEffect, useState } from "react";
import { JsonObjType } from "json-urley";
import Dialog from "@mui/material/Dialog";
import DialogHeader from "../../component/DialogHeader";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import OpenApiQuery from "../../openApi/OpenApiQuery";
import JsonType, { JsonObjectType } from "../../eweyField/JsonType";
import ResultSet from "../ResultSet";
import Result from "../Result";

export interface ItemLabelProps {
  item: JsonObjType
  selected?: boolean | null
}

export interface SelectOneSearchDialogProps {
  dialogOpen: boolean
  onSetDialogOpen: (dialogOpen: boolean) => void
  storeName: string
  resultKey: string | null
  onSetItemKey: (itemKey: string | null) => void
  labelExtractor: (result: Result) => string
  limit?: number
}

export default function SelectOneSearchDialog({ dialogOpen, onSetDialogOpen, storeName, resultKey, onSetItemKey, labelExtractor, limit }: SelectOneSearchDialogProps) {
  const [params, setParams] = useState(generateParams)
  console.log('Need to use params here...')

  useEffect(() => {
    setParams(generateParams())
  }, [limit])

  function generateParams(){
    return {
      search_filter: { query: ''},
      limit: limit || 5
    }
  }

  function renderResultSet(response: JsonType){
    const { results } = response as unknown as ResultSet

    return (
      <Grid container direction="column">
        {results.map(result => {
          return (
            <Grid key={result.key} item>
              <MenuItem onClick={() => {
                onSetDialogOpen(false)
                onSetItemKey(result.key)
              }}>
                <ListItemIcon>
                  <Checkbox checked={resultKey ===result.key} />
                </ListItemIcon>
                <ListItemText>{labelExtractor(result)}</ListItemText>
              </MenuItem>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  return (
    <Dialog open={dialogOpen} onClose={() => onSetDialogOpen(false)} fullWidth>
      <Box padding={2}>
        <DialogHeader label="select" setDialogOpen={() => {
          onSetItemKey(null)
          onSetDialogOpen(false)
        }} />
        <OpenApiQuery operationId={`${storeName}_search`} params={{}}>
          {renderResultSet}
        </OpenApiQuery>
      </Box>
    </Dialog>
  )
}
