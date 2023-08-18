import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import EweyFactory from "../eweyFactory/EweyFactory";
import LoadingComponent from "../component/LoadingComponent";
import ErrorComponent, {
  ErrorComponentProperties,
} from "../component/ErrorComponent";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useOpenApi } from "./OpenApiProvider";
import OpenApiContent from "./OpenApiContent";
import { headersFromToken } from "./OpenApiForm";

export interface OpenApiQueryProps {
  operationId: string;
  factories?: EweyFactory[];
  params?: any;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  ResultsLoadingComponent?: FC;
  ResultsErrorComponent?: FC<ErrorComponentProperties>;
}

const OpenApiQuery: FC<OpenApiQueryProps> = ({
  operationId,
  factories,
  params,
  onSuccess,
  onError,
  ResultsLoadingComponent,
  ResultsErrorComponent,
}) => {
  if (!ResultsLoadingComponent) {
    ResultsLoadingComponent = LoadingComponent;
  }
  if (!ResultsErrorComponent) {
    ResultsErrorComponent = ErrorComponent;
  }
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const {
    isLoading,
    error,
    data: value,
  } = useQuery({
    queryKey: [operation.operationId],
    queryFn: () => operation.invoke(params, headers),
  });

  if (isLoading) {
    return <ResultsLoadingComponent />;
  }

  if (error) {
    return <ResultsErrorComponent />;
  }

  return (
    <OpenApiContent
      operationId={operationId}
      factories={factories}
      value={value}
    />
  );
};

export default OpenApiQuery;
