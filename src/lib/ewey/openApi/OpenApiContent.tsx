import { FC, useEffect, useState } from "react";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { useOpenApi } from "./OpenApiProvider";
import { useEweyFactories } from "../providers/EweyFactoryProvider";

export interface OpenApiContentProps {
  operationId: string;
  value?: any;
}

const OpenApiContent: FC<OpenApiContentProps> = ({
  operationId,
  value,
}) => {
  const openApi = useOpenApi();
  const operation = openApi.getOperation(operationId);
  const [ResultsComponent, setResultsComponent] = useState<any>(null);
  const factories = useEweyFactories();
  useEffect(() => {
    const c = JsonSchemaFieldFactory(
      operation.resultSchema,
      { ...openApi.schema.components },
      [],
      factories,
    );
    setResultsComponent(() => c);
  }, [
    operationId,
    operation.resultSchema,
    openApi.schema.components,
    factories,
  ]);

  return ResultsComponent && <ResultsComponent value={value} />;
};

export default OpenApiContent;
