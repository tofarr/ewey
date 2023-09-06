import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button"
import EweyField from "../eweyField/EweyField"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import Grid from '@mui/material/Grid';
import { CrudDeleteButton } from './CrudDeleteButton';
import { JsonObjectType } from '../eweyField/JsonType';

export const crudActionsWrapper = (
  searchOperationName: string,
  updateOperation?: OpenApiOperation,
  deleteOperation?: OpenApiOperation,
  keyExtractor?: (item: JsonObjectType) => string,
) => {
  if(keyExtractor == null){
    keyExtractor = (item: JsonObjectType) => item?.id as string
  }
  const CrudActionsField: EweyField<any> = ({ path, value, onSetValue }) => {
    const itemKey = (keyExtractor as ((item: JsonObjectType) => string))(value);
    return (
      <Grid container>
        {updateOperation && 
          <Grid item>
            <Button onClick={() => alert('edit')}>
              <EditIcon />
            </Button>
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
