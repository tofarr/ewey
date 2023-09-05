import { useTranslation } from "react-i18next";
import { ValidateFunction } from "ajv";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import EweyField from "./EweyField";
import { getLabel } from "../label";
import Typography from "@mui/material/Typography";

const SelectFieldWrapper = (validate: ValidateFunction<string>, values: string[]) => {
  const SelectField: EweyField<string> = ({ value, onSetValue }) => {
    const { t } = useTranslation()
    if (!onSetValue) {
      return (
        <Typography variant="body2">{getLabel(value, t)}</Typography>
      )
    }
    return (
      <FormControl style={{width: "100%"}}>
        <Select 
          value={value}
          onChange={(event: SelectChangeEvent<any>) => onSetValue(event.target.value as string)}
          error={validate(value)}
        >
          {values.map(v => <MenuItem key={v} value={v}>{getLabel(v, t)}</MenuItem>)}
        </Select>
      </FormControl>
    );
  };
  return SelectField;
};

export default SelectFieldWrapper;
