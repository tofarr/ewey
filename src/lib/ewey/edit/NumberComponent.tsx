import EweyProps from '../EweyProps'
import Typography from '@mui/material/Typography';

const NUMBER_TYPES = ['integer', 'float']

const NumberComponent = ({ value, schema }: EweyProps) => {
  if ((value != null) && NUMBER_TYPES.includes(schema.type)){
    return (
      <Typography variant="body1">{value.toLocaleString()}</Typography>
    )
  }
  return null
}

export default NumberComponent
