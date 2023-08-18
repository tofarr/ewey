import { Validator } from '@cfworker/json-schema';
import JsonSchema from '../../eweyFactory/JsonSchema';
import JsonType from '../../eweyField/JsonType';
import { createUrl } from './OpenApi';
import OpenApiHeaders from './OpenApiHeaders';
import OpenApiOperationSchema from './OpenApiOperationSchema';
import OpenApiSchema from './OpenApiSchema';
import { OpenApiOperation, OpenApiOperationFactory } from './OpenApiOperation';
import { createResultSchema, remapReferences, requiresAuth } from './UrlParamsOperation';

enum PostBodyMethod {
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH'
}

export class PostBodyOperation implements OpenApiOperation {
  operationId: string
  paramsSchema: JsonSchema
  resultSchema: JsonSchema
  requiresAuth: boolean
  url: string
  method: PostBodyMethod
  summary: string
  paramsValidator: Validator | null
  resultValidator: Validator | null

  constructor(
    operationId: string,
    paramsSchema: JsonSchema,
    resultSchema: JsonSchema,
    requiresAuth: boolean,
    url: string,
    method: PostBodyMethod,
    summary: string = "",
    validateParams: boolean = true,
    validateResult: boolean = false
  ) {
    this.operationId = operationId
    this.paramsSchema = paramsSchema
    this.resultSchema = resultSchema
    this.requiresAuth = requiresAuth
    this.url = url
    this.method = method
    this.summary = summary
    this.paramsValidator = validateParams ? new Validator(this.paramsSchema) : null
    this.resultValidator = validateResult ? new Validator(this.resultSchema) : null
  }

  async invoke(params: JsonType, headers?: OpenApiHeaders) {
    if (!params) {
      params = {}
    }
    const rawResponse = await fetch(
      this.url,
      {
        method: this.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(headers || {})
        },
        body: JSON.stringify(params)
      }
    )
    const content = await rawResponse.json()
    return content
  }
}

export const createBodySchema = (operationSchema: OpenApiOperationSchema, apiSchema: OpenApiSchema) => {
  let result = operationSchema.requestBody.content["application/json"].schema
  result = remapReferences(result, apiSchema)
  return result
}

export class PostBodyOperationFactory implements OpenApiOperationFactory {
  priority: number = 100

  create(operationSchema: OpenApiOperationSchema, path: string, method: string, schema: OpenApiSchema) {
      if (!Object.values(PostBodyMethod).includes(method as PostBodyMethod)) {
        return null
      }
      return new PostBodyOperation(
        operationSchema.operationId,
        createBodySchema(operationSchema, schema),
        createResultSchema(operationSchema, schema),
        requiresAuth(operationSchema),
        createUrl(schema, path),
        method as PostBodyMethod,
        operationSchema.summary,
      )
  }
}
