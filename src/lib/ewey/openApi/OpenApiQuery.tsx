import { FC } from 'react';
import { useQuery } from '@tanstack/react-query'
import { invoke, headersFromToken, requiresAuth } from './util';
import EweyFactory from './../eweyFactory/EweyFactory';
import LoadingComponent from './../component/LoadingComponent';
import ErrorComponent, { ErrorComponentProperties } from './../component/ErrorComponent';
import { useOAuthBearerToken } from '../oauth/OAuthBearerTokenProvider';
import { useOpenApiSchema } from './OpenApiSchemaContext';
import OpenApiContent from './OpenApiContent';

export interface OpenApiQueryProps {
  path: string,
  method?: string,
  factories?: EweyFactory[],
  params?: any,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void,
  ResultsLoadingComponent?: FC,
  ResultsErrorComponent?: FC<ErrorComponentProperties>
}

const OpenApiQuery: FC<OpenApiQueryProps> = ({
  path,
  method,
  factories,
  params,
  onSuccess,
  onError,
  ResultsLoadingComponent,
  ResultsErrorComponent
}) => {
  if (!method) {
    method = "get"
  }
  if (!ResultsLoadingComponent) {
    ResultsLoadingComponent = LoadingComponent
  }
  if (!ResultsErrorComponent) {
    ResultsErrorComponent = ErrorComponent
  }
  const schema = useOpenApiSchema()
  const headers = headersFromToken(useOAuthBearerToken())
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
      path={path}
      method={method}
      factories={factories}
      value={value}
    />
  )
}

export default OpenApiQuery
