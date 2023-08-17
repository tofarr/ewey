import { FC, ReactElement } from 'react';
import OpenApiSchemaLoader from './OpenApiSchemaLoader'
import { OpenApiSchemaContext } from './OpenApiSchemaContext'
import { ErrorComponentProperties } from '../component/ErrorComponent';

export interface OpenApiSchemaProviderProperties{
  url: string
  children: ReactElement | ReactElement[]
  loadingComponent?: FC
  errorComponent?: FC<ErrorComponentProperties>
}

const OpenApiSchemaProvider: FC<OpenApiSchemaProviderProperties> = ({url, children, loadingComponent, errorComponent}) => {
  return (
    <OpenApiSchemaLoader
      url={url}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      {schema => (
        <OpenApiSchemaContext.Provider value={schema}>
          {children}
        </OpenApiSchemaContext.Provider>
      )}
    </OpenApiSchemaLoader>
  )
}

export default OpenApiSchemaProvider
