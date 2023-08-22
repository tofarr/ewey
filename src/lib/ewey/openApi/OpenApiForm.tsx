import { FC, FormEvent, useEffect, useState } from "react";
import { schemaCompiler } from "../schemaCompiler";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useOpenApi } from "./OpenApiProvider";
import { keyToLabel } from "../eweyField/FieldSetWrapper";
import EweyFactory from "../eweyFactory/EweyFactory";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import SubmitComponent, {
  SubmitComponentProperties,
} from "../component/SubmitComponent";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";

export interface OpenApiFormProps {
  operationId: string;
  factories?: EweyFactory[];
  initialValue?: any;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  FormSubmitComponent?: FC<SubmitComponentProperties>;
  displaySummary?: boolean;
}

const OpenApiForm: FC<OpenApiFormProps> = ({
  operationId,
  factories,
  initialValue,
  onSuccess,
  onError,
  FormSubmitComponent,
  displaySummary,
}) => {
  if (!FormSubmitComponent) {
    FormSubmitComponent = SubmitComponent;
  }
  const { t } = useTranslation();
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const [value, setValue] = useState<any>(initialValue || {});
  const validate = schemaCompiler.compile(operation.paramsSchema);
  const valid = validate(value) as boolean;
  const [FormComponent, setFormComponent] = useState<any>(null);
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        const result = await operation.invoke(value, headers);
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (e) {
        if (onError) {
          onError(e);
        }
        throw e;
      }
    },
  });
  useEffect(() => {
    const c = JsonSchemaFieldFactory(
      operation.paramsSchema,
      { ...openApi.schema.components },
      [],
      factories,
    );
    setFormComponent(() => c);
  }, [
    operationId,
    operation.paramsSchema,
    openApi.schema.components,
    factories,
  ]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    handleInvoke();
  }

  function handleInvoke() {
    if (isLoading || !valid) {
      return;
    }
    mutate();
  }

  if (!FormComponent) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper>
        <Box padding={2} marginBottom={2}>
          <Typography variant="h4">
            {t(operationId, keyToLabel(operationId))}
          </Typography>
          {displaySummary && operation.summary && (
            <Box pt={1} pb={1}>
              <Typography variant="body2">{operation.summary}</Typography>
            </Box>
          )}
          <FormComponent value={value} onSetValue={setValue} />
        </Box>
        <FormSubmitComponent
          submitting={isLoading}
          valid={valid}
          onSubmit={handleInvoke}
        />
      </Paper>
    </form>
  );
};

export const headersFromToken = (token: string) => {
  const result: { [key: string]: string } = {};
  if (token) {
    result["Authorization"] = `Bearer ${token}`;
  }
  return result;
};

export default OpenApiForm;
