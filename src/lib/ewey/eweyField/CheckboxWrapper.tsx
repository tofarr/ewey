import { ValidateFunction } from "ajv";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import EweyField from "./EweyField";

const CheckboxWrapper = (validate: ValidateFunction<boolean>) => {
  const CheckboxField: EweyField<boolean> = ({ value, onSetValue }) => {
    const props: CheckboxProps = {
      checked: !!value,
    };
    if (onSetValue) {
      props.onClick = () => onSetValue(!value);
    }
    if (!validate(!!value)) {
      props.color = "error";
    }
    return <Checkbox {...props} />;
  };
  return CheckboxField;
};

export default CheckboxWrapper;
