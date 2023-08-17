import { FC } from 'react';
import { useQuery } from '@tanstack/react-query'
//import { invoke, headersFromToken, requiresAuth, getFetchParamsFromSchema } from './util';
import EweyFactory from '../eweyFactory/EweyFactory';
import LoadingComponent from '../component/LoadingComponent';
import ErrorComponent, { ErrorComponentProperties } from '../component/ErrorComponent';
//import { useOAuthBearerToken } from '../oauth/OAuthBearerTokenProvider';
//import { useOpenApiSchema } from './OpenApiSchemaContext';
//import OpenApiContent from './OpenApiContent';

export interface OpenApiQueryProps {
  operationId: string,
  factories?: EweyFactory[],
  params?: any,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void,
  ResultsLoadingComponent?: FC,
  ResultsErrorComponent?: FC<ErrorComponentProperties>
}

/*
const OpenApiQuery: FC<OpenApiQueryProps> = ({
  operationId,
  factories,
  params,
  onSuccess,
  onError,
  ResultsLoadingComponent,
  ResultsErrorComponent
}) => {
  if (!ResultsLoadingComponent) {
    ResultsLoadingComponent = LoadingComponent
  }
  if (!ResultsErrorComponent) {
    ResultsErrorComponent = ErrorComponent
  }
  const openApi = useOpenApi()
  const { path, method } = getFetchParamsFromSchema(schema, operationId)
  const headers = headersFromToken(useOAuthBearerToken()?.token)
  const url = schema.schema.servers[0].url + path
  const { isLoading, error, data: value } = useQuery({
    queryKey: [url],
    queryFn: () => invoke(schema, path, method as string, params, headers)
  })

  if (isLoading) {
    return <ResultsLoadingComponent />
  }

  if (error) {
    return <ResultsErrorComponent />
  }

  return (
    <OpenApiContent
      operationId={operationId}
      factories={factories}
      value={value}
    />
  )
}

export default OpenApiQuery
*/
