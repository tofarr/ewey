import EweyProps from '../EweyProps'
import Checkbox from '@mui/material/Checkbox';

const BooleanComponent = ({ value, schema, setValue }: EweyProps) => {
  if (schema.type === 'boolean'){
    return (
      <Checkbox checked={!!value} onClick={() => setValue(!value)} />
    )
  }
  return null
}

export default BooleanComponent
