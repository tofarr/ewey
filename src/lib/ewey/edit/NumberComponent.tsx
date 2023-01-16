import { ChangeEvent, useState } from 'react';
import EweyProps from '../EweyProps'
import TextField from '@mui/material/TextField';
import { Validator } from '@cfworker/json-schema';

const NUMBER_TYPES = ['integer', 'number']

const NumberComponent = ({ value, schema, setValue }: EweyProps) => {
  const [displayValue, setDisplayValue] = useState(''+value)
  if (!NUMBER_TYPES.includes(schema.type)){
    return null
  }
  const validator = new Validator(schema)
  const validationResult = validator.validate(value)
  const inputProps: any = typeof value === 'string' ? {} : {inputMode: "numeric"}

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDisplayValue(event.target.value)
    let newValue: number|string = Number(event.target.value)
    if (isNaN(newValue)){
      newValue = event.target.value
    }
    setValue(newValue)
  }

  return (
    <TextField
      error={!validationResult.valid}
      value={displayValue}
      onChange={handleChange}
      inputProps={inputProps} />
  )
}

export default NumberComponent
