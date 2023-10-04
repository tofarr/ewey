import { ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../component/LoadingComponent";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useOpenApi } from "./OpenApiProvider";
import { headersFromToken } from "../openApi/headers";
import { OpenApiQueryContentProps } from "./OpenApiQueryContent";
import JsonType from "../eweyField/JsonType";
import ErrorComponent from "../component/ErrorComponent";

export interface OpenApiQueryProps extends OpenApiQueryContentProps {
  children: (value: JsonType) => ReactElement
}

const OpenApiQuery = ({
  operationId,
  params,
  ResultsLoadingComponent,
  ResultsErrorComponent,
  refetchOnMount,
  children,
}: OpenApiQueryProps) => {
  if (!ResultsLoadingComponent) {
    ResultsLoadingComponent = LoadingComponent;
  }
  if (!ResultsErrorComponent) {
    ResultsErrorComponent = ErrorComponent;
  }
  if (refetchOnMount == null) {
    refetchOnMount = true
  }
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const {
    isLoading,
    error,
    data: value,
  } = useQuery({
    queryKey: [operation.operationId, params, headers],
    refetchOnMount,
    queryFn: () => operation.invoke(params, headers),
  });

  if (isLoading) {
    return <ResultsLoadingComponent />;
  }

  if (error) {
    return <ResultsErrorComponent />;
  }

  return children(value as JsonType)
};

export default OpenApiQuery;
