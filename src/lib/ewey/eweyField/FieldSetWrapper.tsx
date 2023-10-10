import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { EweyLayoutHint, EweyLayoutHintProvider, useEweyLayoutHint } from "../providers/EweyLayoutHint";
import EweyField from "./EweyField";
import { getLabel } from "../label";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { Fragment, useState } from "react";
import Menu from "@mui/material/Menu";
import Paper from "@mui/material/Paper";

const FieldSetWrapper = (
  fieldsByKey: any,
  alwaysFullWidth: boolean,
  labelFields: string[],
  requiredFieldNames: string[],
  defaultValueFactories: any,
  selectOptional: boolean
) => {
  const FieldSetComponent: EweyField<any> = ({ path, value, onSetValue }) => {
    if (!value){
      value = {}
    }
    const { t } = useTranslation();
    let fieldKeys = Object.keys(fieldsByKey)
    const existingKeys = Object.keys(value);
    const eweyLayoutHint = useEweyLayoutHint()
    const labelsAlwaysAbove = alwaysFullWidth || [EweyLayoutHint.LABELS_ALWAYS_ABOVE, EweyLayoutHint.NESTED].includes(eweyLayoutHint as EweyLayoutHint);

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
        <Grid container alignItems="center" spacing={2}>
          <Grid item md={labelsAlwaysAbove ? false : 3}></Grid>
          <Grid item>
            <FormControlLabel control={renderField(key)} label={getLabel(key, t)} />
          </Grid>
          {onSetValue && 
            <Grid item>
              <IconButton onClick={() => {
                const newValue = { ...value }
                delete newValue[key]
                onSetValue(newValue)
              }}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          }
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
            {getLabel('undefined', t)}
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
              <IconButton onClick={() => {
                const newValue = { ...value }
                delete newValue[key]
                onSetValue(newValue)
              }}>
                <DeleteIcon />
              </IconButton>
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
      const fieldPath = [...(path || []), key]
      return (
        <Component path={fieldPath} value={fieldValue} onSetValue={onSetFieldValue} />
      )
    }

    function renderSelectForOptionalFields(){
      const selectOptions = Object.keys(fieldsByKey).filter(k => !existingKeys.includes(k));
      if (!selectOptions.length){
        return null
      }
      return (
        <Grid container alignItems="center" pt={3}>
          <Grid item xs={12} md={labelsAlwaysAbove ? 12 : 3}></Grid>
          <Grid
            item
            xs={12}
            md={labelsAlwaysAbove ? 12 : 9}
            lg={labelsAlwaysAbove ? 12 : 6}
            pl={1}
          >
            <OptionalFieldSelect selectOptions={selectOptions} onSelect={handleAddDefault} />
          </Grid>
        </Grid>
      )
    }

    if(fieldKeys.length === 1){
      return renderField(fieldKeys[0])
    }

    if (selectOptional) {
      fieldKeys = fieldKeys.filter(k => existingKeys.includes(k));
    }

    function renderFields(){
      return (
        <Grid container spacing={1} alignItems="center">
          {fieldKeys.map(key => (
            <Grid item key={key} xs={12}>
              <Grid container alignItems="center">
                {labelFields.includes(key) && existingKeys.includes(key) ? renderFieldLabelRow(key) : renderFieldRow(key)}
              </Grid>
            </Grid>
          ))}
          {selectOptional && onSetValue && renderSelectForOptionalFields()}
        </Grid>
      )
    }

    if (eweyLayoutHint == EweyLayoutHint.NESTED){
      return (
        <Paper>
          <Box padding={1}>
            {renderFields()}
          </Box>
        </Paper>
      )
    }

    return (
      <EweyLayoutHintProvider hint={EweyLayoutHint.NESTED}>
        {renderFields()}
      </EweyLayoutHintProvider>
    )
  };

  return FieldSetComponent;
};

export default FieldSetWrapper;


interface OptionalFieldSelectProps{
  selectOptions: string[],
  onSelect: (value: string) => void
}


function OptionalFieldSelect({ selectOptions, onSelect}: OptionalFieldSelectProps){
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const open = Boolean(anchorEl);

  return (
    <Fragment>
      <Button variant="outlined" endIcon={<AddIcon />} onClick={(event) => setAnchorEl(event.currentTarget)}>{getLabel('optional_values', t)}</Button>
      <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
        {selectOptions.map(opt => (
          <MenuItem
            key={opt}
            onClick={() => {
              setAnchorEl(null)
              onSelect(opt)
            }}
          >
            {getLabel(opt, t)}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  )
}