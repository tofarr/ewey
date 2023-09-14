import { FC, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useOpenApi } from "./OpenApiProvider";
import { SubmitComponentProps } from "../component/SubmitComponent";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { CancelComponentProps } from "../component/CancelComponent";
import EweyForm from "../EweyForm";
import JsonType from "../eweyField/JsonType";
import { JsonObjectType } from "../eweyField/JsonType";
import { headersFromToken } from "../openApi/headers";
import { newCreateDefaultFnForSchema } from "../schemaCompiler";

export interface OpenApiFormProps {
  operationId: string;
  value?: JsonType;
  onSetValue?: (value: JsonType) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  submitComponent?: FC<SubmitComponentProps>;
  cancelComponent?: FC<CancelComponentProps>;
  displaySummary?: boolean;
}

const OpenApiForm: FC<OpenApiFormProps> = ({
  operationId,
  value,
  onSetValue,
  onSuccess,
  onError,
  onCancel,
  submitComponent,
  cancelComponent,
  displaySummary,
}) => {
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const disconnected = typeof value === "undefined" && typeof onSetValue === "undefined";
  const [internalValue, setInternalValue] = useState<JsonType>(createDefaultValue());
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try {
        const params = (disconnected ? internalValue : value) as JsonObjectType;
        const result = await operation.invoke(params, headers);
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

  function createDefaultValue(): JsonType {
    if (value != null) {
      return value;
    }
    const defaultFactory = newCreateDefaultFnForSchema(operation.paramsSchema, operation.paramsSchema.components || {});
    const result = defaultFactory ? defaultFactory() : null;
    return result;
  }

  
  function handleSetValue(newValue: JsonType) {
    if (!disconnected && onSetValue) {
      onSetValue(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <EweyForm
      schema={operation.paramsSchema}
      value={disconnected ? internalValue : value}
      onSetValue={handleSetValue}
      isLoading={isLoading}
      onSubmit={() => mutate()}
      onCancel={onCancel}
      submitComponent={submitComponent}
      cancelComponent={cancelComponent}
      labelKey={operationId}
      summary={displaySummary ? operation.summary : null}
    />
  );
};

export default OpenApiForm;
