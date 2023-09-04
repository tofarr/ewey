import { FC, FormEvent, useEffect, useState } from "react";
import { AnySchemaObject, ValidateFunction, schemaCompiler } from "./schemaCompiler";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import EweyFactory from "./eweyFactory/EweyFactory";
import JsonSchemaFieldFactory from "./JsonSchemaFieldFactory";
import SubmitComponent, {
  SubmitComponentProps,
} from "./component/SubmitComponent";
import { getLabel } from "./label";
import { JsonType } from "json-urley";
import CancelComponent, { CancelComponentProps } from "./component/CancelComponent";
import EweyField from "./eweyField/EweyField";
import { newCreateDefaultFnForSchema } from "./eweyFactory/ListFactory";

interface EweyFormState {
  component: EweyField<JsonType>
  validate: ValidateFunction
}

interface EweyFormProps {
  schema: AnySchemaObject;
  isLoading: boolean;
  value?: JsonType;
  onSetValue?: (value?: JsonType) => void;
  onSubmit: (value?: JsonType) => void;
  onCancel?: () => void;
  factories?: EweyFactory[];
  submitComponent?: FC<SubmitComponentProps>;
  cancelComponent?: FC<CancelComponentProps>;
  labelKey?: string;
  summary?: string | null;
}

const EweyForm = (props: EweyFormProps) => {
  if (typeof props.value === "undefined" && typeof props.onSetValue === "undefined") {
    return <DisconnectedEweyForm {...props} />
  }
  return <EweyFormInternal {...props} />
};

function DisconnectedEweyForm({
  schema,
  value,
  onSetValue,
  isLoading,
  onSubmit,
  onCancel,
  factories,
  submitComponent,
  cancelComponent,
  labelKey,
  summary,
}: EweyFormProps) {
  const [internalValue, setInternalValue] = useState(createDefaultValue());

  function createDefaultValue(): JsonType {
    if (internalValue) {
      return internalValue
    }
    if (value != null) {
      return value;
    }
    const defaultFactory = newCreateDefaultFnForSchema(schema, schema.components || {});
    const result = defaultFactory ? defaultFactory() : null;
    return result;
  }

  function handleSetValue(newValue?: JsonType){
    if (newValue == null) {
      newValue = null;
    }
    setInternalValue(newValue);
    if (onSetValue) {
      onSetValue(newValue);
    }
  }

  return EweyFormInternal({
    schema,
    value,
    onSetValue: handleSetValue,
    isLoading,
    onSubmit,
    onCancel,
    factories,
    submitComponent,
    cancelComponent,
    labelKey,
    summary,
  })
}


function EweyFormInternal({
  schema,
  value,
  onSetValue,
  isLoading,
  onSubmit,
  onCancel,
  factories,
  submitComponent,
  cancelComponent,
  labelKey,
  summary,
}: EweyFormProps) {
  const FormSubmitComponent = submitComponent || SubmitComponent;
  const FormCancelComponent = cancelComponent || CancelComponent;
  const { t } = useTranslation();
  const [formState, setFormState] = useState<EweyFormState | null>(null)
  const valid = formState ? formState.validate(value) : false;
  
  useEffect(() => {
    const newFormState = {
      component: JsonSchemaFieldFactory(
        schema,
        { ...schema.components },
        [],
        factories,
      ),
      validate: schemaCompiler.compile(schema)
    }
    setFormState(newFormState)
  }, [
    schema,
    factories,
  ]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (onSubmit && valid && !isLoading) {
      onSubmit(value);
    }
  }

  if (!formState) {
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
          <formState.component value={value} onSetValue={onSetValue} />
        </Box>
        {onCancel && (
          <FormCancelComponent onCancel={onCancel} />
        )}
        <FormSubmitComponent
          submitting={isLoading}
          valid={formState.validate(value)}
          onSubmit={() => onSubmit(value)}
        />
      </Paper>
    </form>
  );
}

export default EweyForm;
