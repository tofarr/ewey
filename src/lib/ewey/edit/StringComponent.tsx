import * as React from 'react';
import EweyProps from '../EweyProps';
import TextField from '@mui/material/TextField';
//import { Draft07, Draft, JSONError } from "json-schema-library";
import { Validator } from '@cfworker/json-schema';


const StringComponent = ({ value, schema, setValue, path }: EweyProps) => {
  if (schema.type !== 'string') {
    return null
  }
  //const jsonSchema: Draft = new Draft07(schema)
  //const errors: JSONError[] = jsonSchema.validate(value);
  const validator = new Validator(schema)
  const validationResult = validator.validate(value)
  const format = schema.format
  const maxLength = schema.maxLength
  const multiline = !(format) && ((!maxLength) || (maxLength > 255))
  return (
    <TextField
      error={!validationResult.valid}
      fullWidth
      multiline={multiline}
      value={value}
      onChange={event => setValue(event.target.value)} />
  )
}

export default StringComponent
