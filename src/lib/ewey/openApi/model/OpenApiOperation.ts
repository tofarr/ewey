import JsonSchema from '../../eweyFactory/JsonSchema';
import JsonType from './JsonType';
import OpenApiHeaders from './OpenApiHeaders';
import OpenApiOperationSchema from './OpenApiOperationSchema';
import OpenApiSchema from './OpenApiSchema';

export interface OpenApiOperation {
  operationId: string
  paramsSchema: JsonSchema
  resultSchema: JsonSchema
  requiresAuth: boolean
  summary: string
  invoke: (value: JsonType, headers?: OpenApiHeaders) => Promise<JsonType>
}

export interface OpenApiOperationFactory {
  priority: number
  create: (operationSchema: OpenApiOperationSchema, path: string, method: string, schema: OpenApiSchema) => OpenApiOperation | null
}
