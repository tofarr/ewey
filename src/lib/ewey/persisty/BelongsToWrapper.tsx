import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button"
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider"
import { useOpenApi } from "../openApi/OpenApiProvider"
import OpenApiQuery from "../openApi/OpenApiQuery";
import { Fragment, useState } from "react";
import { JsonObjectType } from "../eweyField/JsonType";
import SelectOneSearchDialog from "./SelectOneSearchDialog";
import EweyField from "../eweyField/EweyField";

export default function BelongsToWrapper(
  store: string,
  validate: (itemKey: string | null) => boolean,
  keyExtractor: (item: JsonObjectType) => string,
  labelExtractor: (item: JsonObjectType) => string,
) {
  const BelongsToField: EweyField<string|null> = ({ value, onSetValue }) => {
    const openApi = useOpenApi()
    const readOperation = openApi.operations.find(op => op.operationId === `${store}_read`)
    const searchOperation = openApi.operations.find(op => op.operationId === `${store}_search`)
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
          {item => item ? <Fragment>{labelExtractor(item as JsonObjectType)}</Fragment> : <ErrorIcon color="error" />}
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
            store={store}
            itemKey={value} 
            onSetItemKey={onSetValue}
            labelExtractor={labelExtractor}
            keyExtractor={keyExtractor}
          />
        }
      </Fragment>
    )
  }
  return BelongsToField
}
