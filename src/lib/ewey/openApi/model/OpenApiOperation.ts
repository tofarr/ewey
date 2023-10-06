import { JsonType } from "json-urley";
import { AnySchemaObject } from "../../schemaCompiler";
import OpenApiHeaders from "./OpenApiHeaders";
import OpenApiOperationSchema from "./OpenApiOperationSchema";
import OpenApiSchema from "./OpenApiSchema";

export interface OpenApiOperation {
  operationId: string;
  paramsSchema: AnySchemaObject;
  resultSchema: AnySchemaObject;
  requiresAuth: boolean;
  summary: string;
  invoke: (value: JsonType, headers?: OpenApiHeaders) => Promise<JsonType>;
}

export interface OpenApiOperationFactory {
  priority: number;
  create: (
    operationSchema: OpenApiOperationSchema,
    path: string,
    method: string,
    schema: OpenApiSchema,
  ) => OpenApiOperation | null;
}
