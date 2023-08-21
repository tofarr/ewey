import { useTranslation } from "react-i18next";
import EweyField from "./EweyField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { keyToLabel } from "../eweyField/FieldSetWrapper";

const NullableFieldWrapper = (
  Component: EweyField<any>,
  createItem?: () => any,
) => {
  const NullableComponent: EweyField<any> = ({ value, onSetValue }) => {
    const { t } = useTranslation();
    return (
      <Grid container spacing={1}>
        <Grid item>
          {(value == null) ?
            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Typography>{t('no_value', keyToLabel('no_value'))}</Typography>
            </Box>
            :
            <Component value={value} onSetValue={onSetValue} />
          }
        </Grid>
        {value != null && onSetValue && (
          <Grid>
            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Button onClick={() => onSetValue(null)}>
                <DeleteIcon />
              </Button>
            </Box>
          </Grid>
        )}
        {value == null && onSetValue && createItem && (
          <Grid>
            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Button onClick={() => onSetValue(createItem())}>
                <AddIcon />
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };
  return NullableComponent;
};

export default NullableFieldWrapper;
