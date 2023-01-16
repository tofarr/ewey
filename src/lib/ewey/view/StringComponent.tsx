import EweyProps from '../EweyProps'
import Typography from '@mui/material/Typography';

const StringComponent = ({ value, schema }: EweyProps) => {
  if (schema.type != 'string') {
    return null
  }
  return (
    <Typography variant="body1">{value}</Typography>
  )
}

export default StringComponent
