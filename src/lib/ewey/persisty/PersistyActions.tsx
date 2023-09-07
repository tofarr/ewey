import EweyField from "../eweyField/EweyField"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import Grid from '@mui/material/Grid';
import { PersistyDeleteButton } from './PersistyDeleteButton';
import { JsonObjectType } from '../eweyField/JsonType';
import { PersistyUpdateButton } from './PersistyUpdateButton';

export const persistyActionsWrapper = (
  searchOperationName: string,
  updateOperation?: OpenApiOperation,
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
    const width = (updateOperation ? 48 : 0) + (deleteOperation ? 48 : 0)
    return (
      <Grid container direction="row" width={width} spacing={1}>
        {updateOperation && 
          <Grid item>
            <PersistyUpdateButton
              initialValues={value}
              searchOperationName={searchOperationName} 
              updateOperation={updateOperation}
            />
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
