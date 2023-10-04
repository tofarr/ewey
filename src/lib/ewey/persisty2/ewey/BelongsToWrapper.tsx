import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button"
import { useOAuthBearerToken } from "../../oauth/OAuthBearerTokenProvider"
import { useOpenApi } from "../../openApi/OpenApiProvider"
import OpenApiQuery from "../../openApi/OpenApiQuery";
import { Fragment, useState } from "react";
import { JsonObjectType } from "../../eweyField/JsonType";
// import SelectOneSearchDialog from "./SelectOneSearchDialog";
import EweyField from "../../eweyField/EweyField";
import Result from "../Result";
import SelectOneSearchDialog from "../components/SelectOneSearchDialog";


export default function BelongsToWrapper(
  storeName: string,
  validate: (itemKey: string | null) => boolean,
  labelExtractor: (result: Result) => string,
) {
  const BelongsToField: EweyField<string|null> = ({ value, onSetValue }) => {
    const openApi = useOpenApi()
    const readOperation = openApi.operations.find(op => op.operationId === `${storeName}_read`)
    const searchOperation = openApi.operations.find(op => op.operationId === `${storeName}_search`)
    const token = useOAuthBearerToken()
    const isReadable = readOperation && (!readOperation.requiresAuth || !!token?.token);
    const isSearchable = searchOperation && (!searchOperation.requiresAuth || !!token?.token);
    const isValid = validate(value)
    const [dialogOpen, setDialogOpen] = useState(false)
    
    function renderButtonContent(){
      if (!value){
        return <AddIcon />
      }
      if (!isReadable){
        return value
      }
      return (
        <OpenApiQuery operationId={readOperation.operationId} params={{key: value}}>
          {result => result ? <Fragment>{labelExtractor(result as unknown as Result)}</Fragment> : <ErrorIcon color="error" />}
        </OpenApiQuery>
      )
    }

    return (
      <Fragment>
        <Button 
          variant="outlined"
          color={isValid ? "primary" : "error"}
          disabled={!onSetValue || !isSearchable} 
          onClick={() => setDialogOpen(true)}
        >
          {renderButtonContent()}
        </Button>
        {isSearchable && onSetValue &&
          <SelectOneSearchDialog
            dialogOpen={dialogOpen}
            onSetDialogOpen={setDialogOpen}
            storeName={storeName}
            resultKey={value} 
            onSetItemKey={onSetValue}
            labelExtractor={labelExtractor}
          />
        }
      </Fragment>
    )
  }
  return BelongsToField
}
