import { ValidateFunction } from "ajv";
import Box from "@mui/material/Box";
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
    return (
      <Box pt={0.5}>
        <Checkbox {...props} />
      </Box>
    );
  };
  return CheckboxField;
};

export default CheckboxWrapper;
