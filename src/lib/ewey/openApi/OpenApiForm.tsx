import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useOpenApi } from "./OpenApiProvider";
import EweyFactory from "../eweyFactory/EweyFactory";
import {
  SubmitComponentProperties,
} from "../component/SubmitComponent";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { CancelComponentProperties } from "../component/CancelComponent";
import EweyForm from "../EweyForm";
import { JsonType } from "json-urley";

export interface OpenApiFormProps {
  operationId: string;
  factories?: EweyFactory[];
  initialValue?: any;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  submitComponent?: FC<SubmitComponentProperties>;
  cancelComponent?: FC<CancelComponentProperties>;
  displaySummary?: boolean;
}

const OpenApiForm: FC<OpenApiFormProps> = ({
  operationId,
  factories,
  initialValue,
  onSuccess,
  onError,
  onCancel,
  submitComponent,
  cancelComponent,
  displaySummary,
}) => {
  const { t } = useTranslation();
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const [value, setValue] = useState<any>(initialValue);
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
  
  function handleSetValue(value?: JsonType) {
    setValue(value)
  }

  return (
    <EweyForm
      schema={operation.paramsSchema}
      initialValue={initialValue}
      onSetValue={handleSetValue}
      isLoading={isLoading}
      onSubmit={() => mutate()}
      onCancel={onCancel}
      factories={factories}
      submitComponent={submitComponent}
      cancelComponent={cancelComponent}
      labelKey={operationId}
      summary={displaySummary ? operation.summary : null}
    />
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
