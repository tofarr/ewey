import { Fragment, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useOAuthBearerToken } from "../../oauth/OAuthBearerTokenProvider"
import { useOpenApi } from "../../openApi/OpenApiProvider"
import OpenApiQuery from "../../openApi/OpenApiQuery";
import EweyField from "../../eweyField/EweyField";
import Result from "../Result";
import FileHandleLink, { FileHandle } from "../components/data/FileHandleLink";
import FileUploadForm from "../components/data/FileUploadForm";
import { PersistyDataOperationsProvider } from "../PersistyDataOperationsProvider";
import Button from "@mui/material/Button";
import { OpenApiOperation } from "../../openApi/model/OpenApiOperation";

export default function HasUrlWrapper(
  validate: (itemKey: string | null) => boolean,
  fileStoreName: string
) {
  const HasUrlField: EweyField<string|null> = ({ value, onSetValue }) => {
    const openApi = useOpenApi()
    const readOperation = openApi.operations.find(op => op.operationId === `${fileStoreName}_file_read`)
    const searchOperation = openApi.operations.find(op => op.operationId === `${fileStoreName}_file_search`)
    const token = useOAuthBearerToken()
    const isSearchable = searchOperation && (!searchOperation.requiresAuth || !!token?.token);
    const isValid = validate(value)
    const [dialogOpen, setDialogOpen] = useState(false)
    
    const handleClick = onSetValue ? () => {
      setDialogOpen(true)
    } : undefined

    function renderError(){
      return (
        <Button variant="outlined" disabled={onSetValue == null} onClick={handleClick}>
          <ErrorIcon color="error" />
        </Button>
      )
    }

    function renderLink(){
      if (!value){
        return (
          <Button  variant="outlined" disabled={onSetValue == null} onClick={handleClick}>
            <AddIcon />
          </Button>
        )
      }
      return (
        <OpenApiQuery
          operationId={(readOperation as OpenApiOperation).operationId} 
          params={{file_name: value}}
          ResultsLoadingComponent={() => <Button variant="outlined"><CircularProgress size={24} /></Button>}
          ResultsErrorComponent={renderError}
        >
          {response => {
            if (!response) {
              return renderError()
            }
            const result = response as unknown as Result
            const fileHandle = result.item as unknown as FileHandle
            return (
              <FileHandleLink
                storeName={fileStoreName}
                fileHandle={fileHandle}
                isValid={isValid}
                onClick={handleClick}
              />
            )
          }}
        </OpenApiQuery>
      )
    }

    return (
      <Fragment>
        {renderLink()}
        {isSearchable && onSetValue &&
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogContent>
              <PersistyDataOperationsProvider storeName={fileStoreName}>
                <FileUploadForm onFinishUpload={(fileName) => {
                  onSetValue(fileName)
                  setDialogOpen(false)
                }} />
              </PersistyDataOperationsProvider>
            </DialogContent>
          </Dialog>
        }
      </Fragment>
    )
  }
  return HasUrlField
}
