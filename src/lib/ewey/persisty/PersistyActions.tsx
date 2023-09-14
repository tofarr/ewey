import EweyField from "../eweyField/EweyField"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import Grid from '@mui/material/Grid';
import { PersistyDeleteButton } from './PersistyDeleteButton';
import { JsonObjectType } from '../eweyField/JsonType';
import { PersistyInfoButton } from "./PersistyInfoButton";

export const persistyActionsWrapper = (
  searchOperationName: string,
  readOperation?: OpenApiOperation,
  deleteOperation?: OpenApiOperation,
  keyFactory?: (item: JsonObjectType) => string,
) => {
  if(keyFactory == null){
    keyFactory = (item: JsonObjectType) => {
      return item?.id as string
    }
  }
  const PersistyActionsField: EweyField<any> = ({ value }) => {
    const itemKey = (keyFactory as ((item: JsonObjectType) => string))(value);
    return (
      <Grid container direction="row" spacing={1} justifyContent="flex-end">
        {readOperation && 
          <Grid item>
            <PersistyInfoButton itemKey={itemKey} readOperation={readOperation} />
          </Grid>
        }
        {deleteOperation &&
          <Grid item>
            <PersistyDeleteButton
              itemKey={itemKey}
              searchOperationName={searchOperationName} 
              deleteOperation={deleteOperation}
            />
          </Grid>
        }
      </Grid>
    )
  }
  return PersistyActionsField
}
