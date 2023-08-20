import { useTranslation } from "react-i18next";
import { ValidateFunction } from "ajv";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps, SelectChangeEvent } from "@mui/material/Select";
import EweyField from "./EweyField";
import { keyToLabel } from "./FieldSetWrapper";

const SelectFieldWrapper = (validate: ValidateFunction<string>, values: string[]) => {
  const SelectField: EweyField<string> = ({ value, onSetValue }) => {
    const { t } = useTranslation()
    const props: SelectProps = {
      value,
    };
    if (onSetValue) {
      props.onChange = (event: SelectChangeEvent<any>) => onSetValue(event.target.value as string)
    }
    props.error = validate(value)
    return (
      <Select {...props}>
        {values.map(v => <MenuItem key={v} value={v}>{t(v, keyToLabel(v))}</MenuItem>)}
      </Select>
    );
  };
  return SelectField;
};

export default SelectFieldWrapper;
