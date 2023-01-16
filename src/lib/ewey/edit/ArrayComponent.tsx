import EweyProps from '../EweyProps'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import EditComponent from '.'

const ArrayComponent = ({ value, schema, path, setValue }: EweyProps) => {
  if (schema.type != 'array') {
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
