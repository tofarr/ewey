import EweyField from "./EweyField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

const NullableFieldWrapper = (
  Component: EweyField<any>,
  createItem?: () => any,
) => {
  const NullableComponent: EweyField<any> = ({ value, onSetValue }) => {
    if (onSetValue == null) {
      return <Component value={value} />;
    }
    return (
      <Grid container spacing={1}>
        <Grid item>
          <Component value={value} onSetValue={onSetValue} />
        </Grid>
        {value != null && (
          <Grid>
            <Box display="flex" justifyContent="flex-end" padding={1}>
              <Button onClick={() => onSetValue(null)}>
                <DeleteIcon />
              </Button>
            </Box>
          </Grid>
        )}
        {value == null && createItem && (
          <Grid>
            <Box display="flex" justifyContent="flex-end" padding={1}>
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
