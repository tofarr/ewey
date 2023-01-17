import EweyProps from '../EweyProps'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import EditComponent from '.'

// THE ARRAY COMPONENT NEEDS A WAY OF MAKING NEW ITEMS - A DEFAULT
// WE COULD ALSO CONSIDER A "LabelProvider" pattern...

const ArrayComponent = ({ value, schema, path, setValue }: EweyProps) => {
  if (schema.type !== 'array') {
    return null
  }

  function createSetHandler(index: number) {
    return function(val: any) {
      const newValue = [ ...value ]
      newValue[index] = val
      setValue(newValue)
    }
  }

  return (
    <Paper>
      <Box p={1} textAlign="left">
        <List>
        {value.map((v: any, index:number) => {
          return (
          <ListItem key={index}>
            <EditComponent value={v} schema={schema.items} path={[...path, index.toString()]} setValue={createSetHandler(index)} />
          </ListItem>
          )
          }
        )}
        </List>
      </Box>
    </Paper>
  )
}

export default ArrayComponent
