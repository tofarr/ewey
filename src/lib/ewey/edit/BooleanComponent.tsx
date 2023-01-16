import EweyProps from '../EweyProps'
import Checkbox from '@mui/material/Checkbox';

const BooleanComponent = ({ value, schema }: EweyProps) => {
  if ((value != null) && schema.type === 'boolean'){
    return (
      <Checkbox checked={!!value} readOnly />
    )
  }
  return null
}

export default BooleanComponent
