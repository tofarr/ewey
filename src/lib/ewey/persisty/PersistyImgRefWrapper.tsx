import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import UploadIcon from '@mui/icons-material/Upload';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import Dialog from "@mui/material/Dialog";
import DialogHeader from "../component/DialogHeader";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import EweyField from "../eweyField/EweyField";
import { Fragment, useState } from "react";
import OpenApiQuery from "../openApi/OpenApiQuery";
import { ResultSet } from "./ResultSet";
import { JsonObjectType } from "../eweyField/JsonType";
import { jsonObjToQueryStr } from "json-urley";
import PersistyImg from "./PersistyImg";
import { useOpenApi } from "../openApi/OpenApiProvider";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { PersistyDataUploadForm } from './PersistyDataUploadForm';

const IMG_WIDTH = 64
const IMG_HEIGHT = 50

const SELECT_IMG_WIDTH = 100
const SELECT_IMG_HEIGHT = 100

const PersistyImgRefWrapper = (
  store: string,
  imgWidth: number = IMG_WIDTH,
  imgHeight: number = IMG_HEIGHT
) => {
  const PersistyImgRef: EweyField<string|null> = ({ value, onSetValue }) => {
    const openApi = useOpenApi()
    const [selectDialogOpen, setSelectDialogOpen] = useState(false)
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [pageKey, setPageKey] = useState<string|null|undefined>(null)
    const { t } = useTranslation()
    const imgQueryParams: JsonObjectType = {limit: 3}
    if (pageKey) {
      imgQueryParams.page_key = pageKey
    }
    const getUploadFormOperation = openApi.operations.find(op => op.operationId === `${store}_get_upload_form`)

    function renderOption(item: JsonObjectType){
      if (!onSetValue) {
        throw new Error('illegal_state')
      }
      
      return (
        <Grid key={item.key as string} item>
          <Box position="relative" top={1} right={1}>
            <Button variant="outlined" onClick={() => onSetValue(item.key as string)}>
              {renderImg(item.key as string, SELECT_IMG_WIDTH, SELECT_IMG_HEIGHT)}
            </Button>
            {value === item.key && (
              <Box position="absolute" top={-5} right={-5}>
                <Fab color="primary" style={{transform: 'scale(0.5)'}}>
                  <CheckIcon />
                </Fab>
              </Box>
            )}
          </Box>
        </Grid>
      )
    }

    function renderImg(key: string, width: number, height: number){
      const queryStr = jsonObjToQueryStr({store_name: store, key, width, height})
      const src = `${openApi.schema.servers[0].url}/resized-img?${queryStr}`;
      return (
        <PersistyImg src={src} width={width} height={height} />
      )
    }

    function renderSelectDialog(){
      if (!onSetValue){
        return null
      }
      return (
        <Dialog 
          open={selectDialogOpen}
          onClose={() => setSelectDialogOpen(false)} 
          fullWidth
        >
          <DialogContent>
            <DialogHeader label="select_image" setDialogOpen={setSelectDialogOpen} />
            <OpenApiQuery operationId={`${store}_search`} params={imgQueryParams}>
              {(response) => {
                const resultSet = response as unknown as ResultSet
                return (
                  <Fragment>
                    <Grid container pt={3} pb={3} spacing={1} justifyContent="center">
                      {resultSet.results.map(renderOption)}
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <IconButton
                          disabled={!pageKey}
                          onClick={() => setPageKey(null)}
                        >
                          <KeyboardDoubleArrowLeftIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          disabled={!resultSet.next_page_key}
                          onClick={() => setPageKey(resultSet.next_page_key)}
                        >
                          <KeyboardArrowRightIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs></Grid>
                      {getUploadFormOperation && 
                        <Grid item>
                          <Fab onClick={() => {
                            setUploadDialogOpen(true)
                            setSelectDialogOpen(false)
                          }}>
                          <UploadIcon />
                        </Fab>
                        </Grid>
                      }
                      <Grid item>
                        <Fab onClick={() => {
                          onSetValue(null)
                          setSelectDialogOpen(false)
                        }}>
                          <DeleteIcon />
                        </Fab>
                      </Grid>
                      <Grid item>
                        <Fab color="primary" onClick={() => setSelectDialogOpen(false)}>
                          <CheckIcon />
                        </Fab>
                      </Grid>
                    </Grid>
                  </Fragment>
                ) 
              }}
            </OpenApiQuery>
          </DialogContent>
        </Dialog>
      )
    }

    function renderUploadDialog(){
      if (!onSetValue || !getUploadFormOperation){
        return null
      }
      return (
        <Dialog 
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)} 
          fullWidth
        >
          <DialogContent>
            <DialogHeader label="select_image" setDialogOpen={setUploadDialogOpen} />
            <PersistyDataUploadForm 
              store={store} 
              getUploadFormOperation={getUploadFormOperation} 
              onUpload={result => {
                setUploadDialogOpen(false)
                onSetValue(result.key as string)
              }}
            />
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Fragment>
        <Button 
          variant="outlined"
          disabled={!onSetValue} 
          onClick={() => setSelectDialogOpen(true)}
        >
          <Box width={imgWidth} height={imgHeight} display="flex" justifyContent="center" alignItems="center">
            {value ? renderImg(value, imgWidth, imgHeight) : <PriorityHighIcon />}
          </Box>
        </Button>
        {renderSelectDialog()}
        {renderUploadDialog()}
      </Fragment>
    )
  };
  return PersistyImgRef;
};

export default PersistyImgRefWrapper;
