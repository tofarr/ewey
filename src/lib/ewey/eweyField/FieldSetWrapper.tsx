import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { useEweyLayoutHint } from "../EweyLayoutHint";
import EweyField from "./EweyField";
import { getLabel } from "../label";

const FieldSetWrapper = (
  name: string,
  fieldsByKey: any,
  alwaysFullWidth: boolean,
  labelFields: string[],
  requiredFieldNames: string[],
  defaultValueFactories: any
) => {
  const FieldSetComponent: EweyField<any> = ({ value, onSetValue }) => {
    if (!value){
      value = {}
    }
    const { t } = useTranslation();
    const fieldKeys = Object.keys(fieldsByKey)
    const existingKeys = Object.keys(value);
    const eweyLayoutHint = useEweyLayoutHint()
    const labelsAlwaysAbove = alwaysFullWidth || eweyLayoutHint === 'labelsAlwaysAbove';

    function handleAddDefault(key: string) {
      const newValue = { ...value };
      newValue[key] = defaultValueFactories[key]();
      (onSetValue as any)(newValue)
    }

    function renderFieldRow(key: string) {
      return (
        <Grid container alignItems="center">
          <Grid item xs={12} md={labelsAlwaysAbove ? 12 : 3} pr={2}>
            <Grid
              container
              pr={2}
              sx={{
                justifyContent: {
                  xs: "flex-start",
                  md: labelsAlwaysAbove ? "flex-start" : "flex-end"
                }
              }}
            >
              <Grid item>
                <FormLabel>{getLabel(key, t)}</FormLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={labelsAlwaysAbove ? 12 : 9}
            lg={labelsAlwaysAbove ? 12 : 6}
          >
            {renderNonRequiredField(key)}
          </Grid>
        </Grid>
      )
    }

    function renderFieldLabelRow(key: string) {
      return (
        <Grid container>
          <Grid item xs={labelsAlwaysAbove ? false : 3} md={3}></Grid>
          <Grid item xs>
            <FormControlLabel
              control={renderNonRequiredField(key)}
              label={getLabel(key, t)} />
          </Grid>
        </Grid>
      )
    }

    function renderNonRequiredField(key: string) {
      if (requiredFieldNames.includes(key)){
        return renderField(key);
      }

      if (!existingKeys.includes(key)) {
        return (
          <Button
            variant="outlined"
            disabled={!defaultValueFactories[key] || !onSetValue}
            onClick={() => handleAddDefault(key)}
            endIcon={<AddIcon />}
          >
            {getLabel('empty', t)}
          </Button>
        )
      }

      return (
        <Grid container spacing={1} alignItems="stretch">
          <Grid item xs>
            {renderField(key)}
          </Grid>
          {onSetValue && <Grid item>
            <Box pt={1}>
              <Button onClick={() => {
                const newValue = { ...value }
                delete newValue[key]
                onSetValue(newValue)
              }}>
                <DeleteIcon />
              </Button>
            </Box>
          </Grid>}
        </Grid>
      )
    }

    function renderField(key: string) {
      const Component = fieldsByKey[key];
      const fieldValue = value[key];
      let onSetFieldValue = null;
      if (onSetValue) {
        onSetFieldValue = (newFieldValue: any) => {
          const newValue = { ...value };
          newValue[key] = newFieldValue;
          onSetValue(newValue);
        };
      }
      return (
        <Component value={fieldValue} onSetValue={onSetFieldValue} />
      )
    }

    if(fieldKeys.length === 1){
      return renderField(fieldKeys[0])
    }

    return (
      <Grid container spacing={1} alignItems="center">
        {fieldKeys.map(key => (
          <Grid item key={key} xs={12}>
            <Grid container alignItems="center">
              {labelFields.includes(key) && existingKeys.includes(key) ? renderFieldLabelRow(key) : renderFieldRow(key)}
            </Grid>
          </Grid>
        ))}
      </Grid>
    )
  };

  return FieldSetComponent;
};

export default FieldSetWrapper;
