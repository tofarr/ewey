import { useOpenApi } from "../openApi/OpenApiProvider"
import OpenApiQuery from "../openApi/OpenApiQuery";
import { JsonObjType } from "json-urley";
import { FC, useEffect, useState } from "react";
import JsonType, { JsonObjectType } from "../eweyField/JsonType";
import Dialog from "@mui/material/Dialog";
import DialogHeader from "../component/DialogHeader";
import { ResultSet } from "./ResultSet";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Radio } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";

export interface ItemLabelProps {
  item: JsonObjType
  selected?: boolean | null
}

export interface SelectOneSearchDialogProps {
  dialogOpen: boolean
  onSetDialogOpen: (dialogOpen: boolean) => void
  store: string
  itemKey: string | null
  onSetItemKey: (itemKey: string | null) => void
  keyExtractor: (item: JsonObjectType) => string
  labelExtractor: (item: JsonObjectType) => string
  limit?: number
}

export default function SelectOneSearchDialog({ dialogOpen, onSetDialogOpen, store, itemKey, onSetItemKey, keyExtractor, labelExtractor, limit }: SelectOneSearchDialogProps) {
  const openApi = useOpenApi()
  const [params, setParams] = useState(generateParams)

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
    const { results, next_page_key } = response as unknown as ResultSet

    return (
      <Grid container direction="column">
        {results.map(item => {
          const key = keyExtractor(item)
          return (
            <Grid key={key} item>
              <MenuItem onClick={() => {
                onSetDialogOpen(false)
                onSetItemKey(key)
              }}>
                <ListItemIcon>
                  <Checkbox checked={itemKey === key} />
                </ListItemIcon>
                <ListItemText>{labelExtractor(item)}</ListItemText>
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
        <OpenApiQuery operationId={`${store}_search`} params={{}}>
          {renderResultSet}
        </OpenApiQuery>
      </Box>
    </Dialog>
  )
}
