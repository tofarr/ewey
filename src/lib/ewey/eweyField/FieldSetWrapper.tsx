import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import EweyField from "./EweyField";

const FieldSetWrapper = (
  name: string,
  componentsByKey: any,
  alwaysFullWidth: boolean,
  labelFields: string[],
  requiredFieldNames: string[],
) => {
  const FieldSetComponent: EweyField<any> = ({ value, onSetValue }) => {
    if (value == null) {
      value = {};
    }
    const { t } = useTranslation();

    function renderField(key: string) {

      if (labelFields.includes(key)) {
        return (
          <Box
            key={key}
            sx={{ paddingBottom: 1}}
          >
            <Grid container>
              <Grid item xs={alwaysFullWidth ? false : 3}>
              </Grid>
              <Grid item xs={12} sm={12} md={alwaysFullWidth ? 12 : 9}>
                <Box pl={2}>
                  <FormControlLabel
                    control={renderFieldInner(key)}
                    label={t(key, keyToLabel(key))} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        )
      }

      return (
        <Box
          key={key}
          sx={{ paddingBottom: { xs: 1, md: alwaysFullWidth ? 1 : 2 } }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={alwaysFullWidth ? 12 : 3}>
              <Grid
                container
                sx={{
                  justifyContent: {
                    sm: "flex-start",
                    md: alwaysFullWidth ? "flex-start" : "flex-end",
                  },
                }}
              >
                <Grid item>
                  <Box pt={2}>
                    <FormLabel>{t(key, keyToLabel(key))}</FormLabel>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={alwaysFullWidth ? 12 : 9}>
              {renderFieldInner(key)}
            </Grid>
          </Grid>
        </Box>
      );
    }

    function renderFieldInner(key: string) {
      const Component = componentsByKey[key];
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

    const keys = Object.keys(componentsByKey);
    if(keys.length === 1){
      return renderFieldInner(keys[0])
    }

    return (
      <Box p={1} textAlign="left">
        {Object.keys(componentsByKey).map(renderField)}
      </Box>
    );
  };

  return FieldSetComponent;
};

export function keyToLabel(key: string) {
  try{
    return key
      .split("_")
      .filter(p => !!p)
      .map((p) => p[0].toUpperCase() + p.substr(1))
      .join(" ");
  }catch (e) {
    console.log(key, e)
    debugger
  }
}

export default FieldSetWrapper;
