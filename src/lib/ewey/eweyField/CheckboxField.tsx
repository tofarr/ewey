import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import EweyField from './EweyField';

const CheckboxField: EweyField<boolean> = ({value, onSetValue}) => {
  const props: CheckboxProps = {
    checked: !!value
  }
  if (onSetValue) {
    props.onClick = () => onSetValue(!value)
  }
  return (
    <Checkbox {...props} />
  )
}

export default CheckboxField
