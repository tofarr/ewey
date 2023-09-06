import { useTranslation } from "react-i18next";
import EweyField from "./EweyField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { getLabel } from "../label";

const NullableFieldWrapper = (
  Component: EweyField<any>,
  createItem?: () => any,
) => {
  const NullableComponent: EweyField<any> = ({ value, onSetValue }) => {
    const { t } = useTranslation();

    function handleClick() {
      if (onSetValue && createItem) {
        onSetValue(createItem())
      }
    }

    if (value != null) {
      return (
        <Grid container spacing={1} alignItems="center">
          {onSetValue && <Grid item>
            <Button onClick={() => onSetValue(null)}>
              <DeleteIcon />
            </Button>
          </Grid>}
          <Grid xs item>
            <Component value={value} onSetValue={onSetValue} />
          </Grid>
        </Grid>
      )
    }

    return (
      <Button
        variant="outlined"
        disabled={!createItem}
        onClick={handleClick}
        endIcon={<AddIcon />}
      >
        {getLabel('empty', t)}
      </Button>
    )
  };
  return NullableComponent;
};

export default NullableFieldWrapper;
