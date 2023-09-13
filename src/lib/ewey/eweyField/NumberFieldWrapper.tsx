import { useState, ChangeEvent } from "react";
import { ValidateFunction } from "ajv";
import TextField from "@mui/material/TextField";
import EweyField from "./EweyField";
import { Typography } from "@mui/material";

const NumberFieldWrapper = (
  validate: ValidateFunction<number>,
): EweyField<number> => {
  const NumberFieldComponent: EweyField<number> = ({ value, onSetValue }) => {
    const [displayValue, setDisplayValue] = useState(
      value == null ? "" : value.toString(),
    );
    const validationResult = validate(value || null);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      setDisplayValue(event.target.value);
      let newValue: Number | string = Number(event.target.value);
      if (isNaN(newValue as any)) {
        newValue = event.target.value;
      }
      (onSetValue as any)(newValue);
    }

    if (onSetValue) {
      return <TextField value={displayValue} error={!validationResult} onChange={handleChange} inputProps={{inputMode: "numeric"}} />
    }
    return <Typography variant="body2">{value == null ? "" : value.toLocaleString()}</Typography>
  };
  return NumberFieldComponent;
};

export default NumberFieldWrapper;
