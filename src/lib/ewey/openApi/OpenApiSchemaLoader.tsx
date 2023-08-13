import { FC, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import OpenApiSchema from './OpenApiSchema';
import ErrorComponent, { ErrorComponentProperties } from './../component/ErrorComponent';
import LoadingComponent from './../component/LoadingComponent';
import { sanitizeOpenApiSchema } from './util';

export interface OpenApiSchemaLoaderChildProperties {
  schema: OpenApiSchema
}

export interface OpenApiSchemaLoaderProperties{
  url: string
  children: FC<OpenApiSchemaLoaderChildProperties>
  loadingComponent?: FC
  errorComponent?: FC<ErrorComponentProperties>
}

const OpenApiSchemaLoader: FC<OpenApiSchemaLoaderProperties> = ({url, children, loadingComponent, errorComponent}) => {
  if (!loadingComponent) {
    loadingComponent = LoadingComponent
  }
  if (!errorComponent) {
    errorComponent = ErrorComponent
  }
  const { isLoading, error, data } = useQuery({
    queryKey: [url],
    queryFn: () =>
      fetch(url).then(
        (res) => res.json().then(schema => sanitizeOpenApiSchema(schema, url)),
      ),
  })

  if (error) {
    return (errorComponent as FC<ErrorComponentProperties>)({})
  }
  if (data) {
    return children({schema: data})
  }
  return (loadingComponent as FC)({})
}

export default OpenApiSchemaLoader
