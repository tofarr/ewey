import { ChangeEvent } from 'react';
import { Validator } from '@cfworker/json-schema';
import { Variant } from '@mui/material/styles/createTypography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import EweyField from './EweyField';

const TextFieldWrapper = (validator: Validator, multiline: boolean, type: string = "text", variant: Variant = "body2"): EweyField<string> => {
  const TextFieldComponent: EweyField<string> = ({value, onSetValue}) => {
    const validationResult = validator.validate(value || null)
    if (onSetValue) {
      return <TextField
        error={!validationResult.valid}
        fullWidth
        type={type}
        multiline={multiline}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSetValue(event.target.value)}
      />
    }
    return (
      <Box pl={1} pt={2} pb={2}>
        <Typography variant={variant}>{value}</Typography>
      </Box>
    )
  }
  return TextFieldComponent
}

export default TextFieldWrapper
