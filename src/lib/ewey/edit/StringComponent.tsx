import * as React from 'react';
import EweyProps from '../EweyProps';
import TextField from '@mui/material/TextField';
import { addSchema, validate } from "@hyperjump/json-schema/draft-2020-12";


const StringComponent = ({ value, schema, setValue, path }: EweyProps) => {
  if (schema.type !== 'string') {
    return null
  }
  const key = '/' + path.join('/')
  addSchema(schema, key)
  const result = validate(value, key)
  console.log(result)
  //console.log(addSchema, validate)
  //const validator = new Validator(schema)
  //debugger;
  //errors = validator.validate(value, schema)
  const format = schema.format
  const maxLength = schema.maxLength
  const multiline = !(format) && ((!maxLength) || (maxLength > 255))
  return (
    <TextField fullWidth multiline={multiline} value={value} onChange={event => setValue(event.target.value)} />
  )
}

export default StringComponent
