import { ChangeEvent } from 'react';
import { Validator } from '@cfworker/json-schema';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import EweyComponent from './EweyComponent';

const TextFieldWrapper = (validator: Validator, multiline: boolean, variant: string = "body2"): EweyComponent<string> => {
  const TextFieldComponent: EweyComponent<string> = ({value, onSetValue}) => {
    const validationResult = validator.validate(value || null)
    if (onSetValue) {
      return <TextField
        error={!validationResult.valid}
        fullWidth
        multiline={multiline}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSetValue(event.target.value)}
      />
    }
    return <Typography>{value}</Typography>
  }
  return TextFieldComponent
}

export default TextFieldWrapper
