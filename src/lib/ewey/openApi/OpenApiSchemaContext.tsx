import { createContext, useContext } from 'react';
import OpenApiSchema from './OpenApiSchema';

export const OpenApiSchemaContext = createContext<OpenApiSchema>(null)


export const useOpenApiSchema = () => {
  // Hack to force type checker to accept the type of the context
  const openApiSchema: OpenApiSchema = useContext(OpenApiSchemaContext);
  return openApiSchema;
}
