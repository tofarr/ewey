import { useState, ChangeEvent } from "react";
import { ValidateFunction } from "ajv";
import TextField from "@mui/material/TextField";
import EweyField from "./EweyField";

const NumberFieldWrapper = (
  validate: ValidateFunction<number>,
): EweyField<string> => {
  const NumberFieldComponent: EweyField<string> = ({ value, onSetValue }) => {
    const [displayValue, setDisplayValue] = useState(
      value == null ? "" : value.toString(),
    );
    const validationResult = validate(value || null);
    const props: any = {
      error: !validationResult,
      value: displayValue,
    };
    if (typeof value !== "string") {
      props.inputProps = { inputMode: "numeric" };
    }
    if (onSetValue) {
      props.onChange = handleChange;
    } else {
      props.disabled = true;
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      setDisplayValue(event.target.value);
      let newValue: Number | string = Number(event.target.value);
      if (isNaN(newValue as any)) {
        newValue = event.target.value;
      }
      (onSetValue as any)(newValue);
    }

    return <TextField {...props} />;
  };
  return NumberFieldComponent;
};

export default NumberFieldWrapper;
