import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import EweyComponent from './EweyComponent';

const ListWrapper = (ItemComponent: EweyComponent<any>, createItem?: () => any) => {

  const ListComponent: EweyComponent<any[]> = ({value, onSetValue}) => {
    if (!value) {
      value = []
    }

    function renderItem(v: any, index: number) {
      let onSetItemValue = undefined
      if (onSetValue) {
        onSetItemValue = (val: any) => {
          if(value){
            const newValue = value.slice();
            newValue[index] = val
            onSetValue?.(newValue)
          }
        }
      }

      function handleRemoveItem() {
        const newValue = value?.splice(index, 1)
        onSetValue?.(value)
      }

      return (
        <ListItem key={index}>
          <Grid container spacing={2}>
            <Grid item xs>
              <ItemComponent value={v} onSetValue={onSetItemValue} />
            </Grid>
            {onSetValue && <Grid item>
              <Box pt={1}>
                <IconButton aria-label="delete" onClick={handleRemoveItem}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>}
          </Grid>
        </ListItem>
      )
    }

    function renderCreateButton(){
      if (!createItem || !onSetValue){
        return null
      }

      function handleAppend(){
        if (value){
          const newValue = value.slice()
          newValue.push((createItem as any)())
          onSetValue?.(newValue)
        }
      }

      return (
        <IconButton aria-label="delete" onClick={handleAppend}>
          <AddIcon />
        </IconButton>
      )
    }

    return (
      <Paper>
        <Box p={1} textAlign="left">
          <List>
            {value.map(renderItem)}
          </List>
        </Box>
        {renderCreateButton()}
      </Paper>
    )
  }

  return ListComponent

}

export default ListWrapper
