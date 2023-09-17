import { FC, FormEvent, ReactNode, useEffect, useState } from "react";
import { AnySchemaObject, ValidateFunction, newCreateDefaultFnForSchema, schemaCompiler } from "./schemaCompiler";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import JsonSchemaFieldFactory from "./JsonSchemaFieldFactory";
import SubmitComponent, {
  SubmitComponentProps,
} from "./component/SubmitComponent";
import { getLabel } from "./label";
import JsonType from "./eweyField/JsonType";
import EweyField from "./eweyField/EweyField";
import { useEweyFactories } from "./providers/EweyFactoryProvider";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

interface EweyFormState {
  component: EweyField<JsonType>
  validate: ValidateFunction
}

interface EweyFormProps {
  schema: AnySchemaObject;
  isLoading?: boolean;
  value?: JsonType;
  onSetValue?: (value: JsonType) => void;
  onSubmit: (value: JsonType) => void;
  submitComponent?: FC<SubmitComponentProps>;
  cancelElement?: ReactNode;
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
  submitComponent,
  cancelElement,
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
    submitComponent,
    cancelElement,
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
  submitComponent,
  cancelElement,
  labelKey,
  summary,
}: EweyFormProps) {
  const FormSubmitComponent = submitComponent || SubmitComponent;
  const { t } = useTranslation();
  const [formState, setFormState] = useState<EweyFormState | null>(null)
  const valid = formState ? formState.validate(value) : false;
  const factories = useEweyFactories()
  
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
      onSubmit(value == null ? null : value);
    }
  }

  if (!formState) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box padding={2}>
        {labelKey && (
          <Box pb={3}>
            <Typography variant="h4">
              {getLabel(labelKey, t)}
            </Typography>
          </Box>
        )}
        {summary && (
          <Box pb={3}>
            <Typography variant="body2">{summary}</Typography>
          </Box>
        )}
        <Box pb={3}>
          <formState.component value={value == null ? null : value} onSetValue={onSetValue} />
        </Box>
        <Box>
          <Grid container justifyContent="flex-end" spacing={2}>
            {cancelElement && (
              <Grid item>
                {cancelElement}
              </Grid>
            )}
            <Grid item>
              <FormSubmitComponent
                submitting={!!isLoading}
                valid={valid}
                onSubmit={() => onSubmit(value == null ? null : value)}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </form>
  );
}

export default EweyForm;
