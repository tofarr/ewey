/* eslint-disable react-hooks/exhaustive-deps */
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
  const factories = useEweyFactories();
  const [ResultsComponent, setResultsComponent] = useState<any>(() => generateComponent());
  useEffect(() => {
    const c = generateComponent()
    setResultsComponent(() => c);
  }, [
    operationId,
    operation.resultSchema,
    openApi.schema.components,
    factories,
  ]);

  function generateComponent(){
    const c = JsonSchemaFieldFactory(
      operation.resultSchema,
      { ...openApi.schema.components },
      [],
      factories,
    );
    return c
  }

  return <ResultsComponent value={value} />;
};

export default OpenApiContent;
