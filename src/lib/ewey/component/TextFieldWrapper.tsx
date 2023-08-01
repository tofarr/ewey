import { ChangeEvent } from 'react';
import { Validator } from '@cfworker/json-schema';
import TextField from '@mui/material/TextField';
import EweyComponent from './EweyComponent';

const TextFieldWrapper = (validator: Validator, multiline: boolean, variant: string = "body2"): EweyComponent<string> => {
  const TextFieldComponent: EweyComponent<string> = ({value, onSetValue}) => {
    const validationResult = validator.validate(value || null)
    const props: any = {
      error: !validationResult.valid,
      fullWidth: true,
      multiline,
      value: value
    }
    if (onSetValue) {
      props.onChange = (event: ChangeEvent<HTMLInputElement>) => onSetValue(event.target.value)
    } else {
      props.disabled = true
    }
    return (
      <TextField {...props} />
    )
  }
  return TextFieldComponent
}

export default TextFieldWrapper
