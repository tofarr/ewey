import OpenApiSchema from './OpenApiSchema';
import { OpenApiOperation, OpenApiOperationFactory } from './OpenApiOperation';
import { UrlParamsOperationFactory } from './UrlParamsOperation';
import { PostBodyOperationFactory } from './PostBodyOperation';

export class OpenApi {
  schema: OpenApiSchema
  operations: OpenApiOperation[]
  loginUrl?: string

  constructor(schema: OpenApiSchema, operations: OpenApiOperation[], loginUrl?: string){
    this.schema = schema
    this.operations = operations
    this.loginUrl = loginUrl
  }

  getOperation(operationId: string) {
    for (const op of this.operations) {
      if (op.operationId === operationId) {
        return op
      }
    }
    throw new Error(`no_such_operation:${operationId}`)
  }
}

export const createUrl = (schema: OpenApiSchema, path: string) => {
  let url = schema.servers[0].url
  if (url.endsWith('/')) {
    url = url.substring(0, url.length - 1)
  }
  return url + path
}

export const getLoginUrl = (schema: OpenApiSchema) => {
  let result = schema?.components?.securitySchemes?.OAuth2PasswordBearer?.flows?.password?.tokenUrl
  if (result && !result.startsWith('http')) {
    return createUrl(schema, result)
  }
  return result
}

export const DEFAULT_OPERATION_FACTORIES: OpenApiOperationFactory[] = [
  new UrlParamsOperationFactory(),
  new PostBodyOperationFactory()
]

export const createOpenApi = (schema: OpenApiSchema, operationFactories?: OpenApiOperationFactory[]) => {
  if (!operationFactories) {
    operationFactories = DEFAULT_OPERATION_FACTORIES
  }else{
    operationFactories.sort((a, b) => b.priority - a.priority)
  }
  const operations: OpenApiOperation[] = []
  const paths = schema.paths
  for (const path in paths){
    for (let method in paths[path]) {
      const operationSchema = paths[path][method]
      method = method.toUpperCase()
      let operation = null
      for (const factory of operationFactories) {
        operation = factory.create(operationSchema, path, method, schema)
        if (operation) {
          break
        }
      }
      if (operation) {
        operations.push(operation)
      } else {
        throw new Error('create_operation_failed')
      }
    }
  }
  return new OpenApi(schema, operations, getLoginUrl(schema))
}
