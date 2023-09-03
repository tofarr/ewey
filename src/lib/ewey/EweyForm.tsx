import { FC, FormEvent, useEffect, useState } from "react";
import { AnySchemaObject, ValidateFunction, schemaCompiler } from "./schemaCompiler";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import EweyFactory from "./eweyFactory/EweyFactory";
import JsonSchemaFieldFactory from "./JsonSchemaFieldFactory";
import SubmitComponent, {
  SubmitComponentProperties,
} from "./component/SubmitComponent";
import { getLabel } from "./label";
import { JsonType } from "json-urley";
import CancelComponent, { CancelComponentProperties } from "./component/CancelComponent";
import EweyField from "./eweyField/EweyField";

export interface EweyFormProps {
  schema: AnySchemaObject;
  initialValue?: JsonType;
  onSetValue?: (value?: JsonType) => void;
  isLoading: boolean;
  onSubmit: (value?: JsonType) => void;
  onCancel?: () => void;
  factories?: EweyFactory[];
  submitComponent?: FC<SubmitComponentProperties>;
  cancelComponent?: FC<CancelComponentProperties>;
  labelKey?: string;
  summary?: string;
}

const EweyForm: FC<EweyFormProps> = ({
  schema,
  initialValue,
  onSetValue,
  isLoading,
  onSubmit,
  onCancel,
  factories,
  submitComponent,
  cancelComponent,
  labelKey,
  summary,
}) => {
  const FormSubmitComponent = submitComponent || SubmitComponent;
  const FormCancelComponent = cancelComponent || CancelComponent;
  const { t } = useTranslation();
  const [value, setValue] = useState<JsonType | undefined>(initialValue);
  const [FormComponent, setFormComponent] = useState<EweyField<JsonType> | null>(null)
  const [validate, setValidate] = useState<ValidateFunction | null>(null);
 
  useEffect(() => {
    const c = JsonSchemaFieldFactory(
      schema,
      { ...schema.components },
      [],
      factories,
    );
    const v = schemaCompiler.compile(schema);
    setFormComponent(c);
    setValidate(v);
  }, [
    schema,
    factories,
  ]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  }

  function handleSetValue(value?: JsonType) {
    setValue(value);
    if (onSetValue) {
      onSetValue(value);
    }
  }

  if (!FormComponent || !validate) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper>
        <Box padding={2} marginBottom={2}>
          {labelKey && (
            <Typography variant="h4">
              {getLabel(labelKey, t)}
            </Typography>
          )}
          {summary && (
            <Box pt={1} pb={1}>
              <Typography variant="body2">{summary}</Typography>
            </Box>
          )}
          <FormComponent value={value} onSetValue={handleSetValue} />
        </Box>
        {onCancel && (
          <FormCancelComponent onCancel={onCancel} />
        )}
        <FormSubmitComponent
          submitting={isLoading}
          valid={validate(value)}
          onSubmit={() => onSubmit(value)}
        />
      </Paper>
    </form>
  );
};

export default EweyForm;
