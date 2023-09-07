import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton"
import EweyField from "../eweyField/EweyField"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import Grid from '@mui/material/Grid';
import { CrudDeleteButton } from './CrudDeleteButton';
import { JsonObjectType } from '../eweyField/JsonType';
import { CrudUpdateButton } from './CrudUpdateButton';

export const crudActionsWrapper = (
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
  const CrudActionsField: EweyField<any> = ({ value }) => {
    const itemKey = (keyFactory as ((item: JsonObjectType) => string))(value);
    return (
      <Grid container direction="row" width={150} spacing={1}>
        {updateOperation && 
          <Grid item>
            <CrudUpdateButton
              initialValues={value}
              searchOperationName={searchOperationName} 
              updateOperation={updateOperation}
            />
          </Grid>
        }
        {deleteOperation &&
          <Grid item>
            <CrudDeleteButton
              itemKey={itemKey}
              searchOperationName={searchOperationName} 
              deleteOperation={deleteOperation}
            />
          </Grid>
        }
      </Grid>
    )
  }
  return CrudActionsField
}
