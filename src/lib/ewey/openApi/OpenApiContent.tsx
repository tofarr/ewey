import { FC, useEffect, useState } from 'react';
import { getResultSchema } from './util';
import EweyFactory from './../eweyFactory/EweyFactory';
import JsonSchemaComponentFactory from './../JsonSchemaComponentFactory';
import { useOpenApiSchema } from './OpenApiSchemaContext';

export interface OpenApiContentProps {
  path: string,
  method?: string,
  factories?: EweyFactory[],
  value?: any,
}

const OpenApiContent: FC<OpenApiContentProps> = ({
  path,
  method,
  factories,
  value
}) => {
  if (!method) {
    method = "get"
  }
  const schema = useOpenApiSchema()
  const [ResultsComponent, setResultsComponent] = useState<any>(null)
  useEffect(() => {
    const resultSchema = getResultSchema(schema, path, method as string)
    const c = JsonSchemaComponentFactory(resultSchema, factories)
    setResultsComponent(() => c)
  }, [path, method, schema, factories])

  return ResultsComponent && <ResultsComponent value={value} />
}

export default OpenApiContent
