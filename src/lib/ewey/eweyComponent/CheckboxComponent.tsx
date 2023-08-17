import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import EweyComponent from './EweyComponent';

const CheckboxComponent: EweyComponent<boolean> = ({value, onSetValue}) => {
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

export default CheckboxComponent
