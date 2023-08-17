import { FC, useEffect, useState } from 'react';
import EweyFactory from '../eweyFactory/EweyFactory';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';
import { useOpenApi } from './OpenApiProvider';

export interface OpenApiContentProps {
  operationId: string
  factories?: EweyFactory[],
  value?: any,
}

const OpenApiContent: FC<OpenApiContentProps> = ({
  operationId,
  factories,
  value
}) => {
  const openApi = useOpenApi()
  const operation = openApi.getOperation(operationId)
  const [ResultsComponent, setResultsComponent] = useState<any>(null)
  useEffect(() => {
    const c = JsonSchemaComponentFactory(operation.resultSchema, openApi.schema.components, [], factories)
    setResultsComponent(() => c)
  }, [operationId, operation.resultSchema, openApi.schema.components, factories])

  return ResultsComponent && <ResultsComponent value={value} />
}

export default OpenApiContent
