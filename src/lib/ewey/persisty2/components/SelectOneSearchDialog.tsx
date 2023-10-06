/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { JsonObjType, JsonType } from "json-urley";
import { useDebounce } from "usehooks-ts";
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogHeader from "../../component/DialogHeader";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";

import OpenApiQuery from "../../openApi/OpenApiQuery";
import ResultSet from "../ResultSet";
import Result from "../Result";
import TextField from "@mui/material/TextField";
import HeightAnimator from "../../component/HeightAnimator";


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
  const [queryValue, setQueryValue] = useState('')
  const query = useDebounce(queryValue, 500)
  const [params, setParams] = useState(generateParams)

  useEffect(() => {
    setParams(generateParams())
  }, [limit, query])

  function generateParams(){
    const search_filter: JsonObjType = {}
    if (query) {
      search_filter.query = query
    }
    const result = {
      search_filter,
      limit: limit || 5
    }
    return result
  }

  function renderResultSet(response: JsonType){
    const { results, next_page_key } = response as unknown as ResultSet

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
        {next_page_key && 
          <Grid item>
            <Grid container justifyContent="center">
              <Grid item>
                <IconButton>
                  <ArrowDropDownIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        }
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
         <TextField 
          fullWidth 
          value={queryValue} 
          onChange={(event) => setQueryValue(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <HeightAnimator>
          <OpenApiQuery operationId={`${storeName}_search`} params={params}>
            {renderResultSet}
          </OpenApiQuery>
        </HeightAnimator> 
      </Box>
    </Dialog>
  )
}
