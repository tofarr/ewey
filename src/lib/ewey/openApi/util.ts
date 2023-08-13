import OpenApiSchema from './OpenApiSchema';
import { jsonObjToQueryStr } from 'json-urley'

export const sanitizeOpenApiSchema = (schema: OpenApiSchema, url: string) => {
  if (!schema.servers) {
    const apiUrl = new URL(url)
    apiUrl.pathname = apiUrl.search = ""
    schema.servers = [{
      url: apiUrl.toString()
    }]
  }
  return schema
}

export const getFormSchema = (apiSchema: OpenApiSchema, path: string, method: string) => {
  const pathSchema = apiSchema.schema.paths[path]
  method = method.toLowerCase()
  let operationSchema = pathSchema[method]
  if (["get", "delete", "options"].includes(method)){
    return getFormSchemaWithNoBody(operationSchema, apiSchema)
  } else {
    return getFormSchemaWithBody(operationSchema, apiSchema)
  }
}

function getFormSchemaWithNoBody(operationSchema: any, apiSchema: OpenApiSchema) {
  const properties: any = {}
  const required: string[] = []
  for (const param of (operationSchema.parameters || [])) {
    if (param.required){
      required.push(param.name)
    }
    properties[param.name] = param.schema
  }
  let result = {
    type: 'object',
    name: operationSchema.operationId,
    properties,
    required
  }
  result = remapReferences(result, apiSchema)
  return result
}

function getFormSchemaWithBody(operationSchema: any, apiSchema: any){
  let result = operationSchema.requestBody.content["application/json"].schema
  result = remapReferences(result, apiSchema)
  return result
}

export const getResultSchema = (apiSchema: OpenApiSchema, path: string, method: string) => {
  const pathSchema = apiSchema.schema.paths[path]
  method = method.toLowerCase()
  const operationSchema = pathSchema[method]
  const result = operationSchema.responses["200"].content['application/json'].schema
  const remappedResult = remapReferences(result, apiSchema)
  return remappedResult
}

export const remapReferences = (formSchema: any, apiSchema: any) => {
  formSchema = { ...formSchema, components: apiSchema.components }
  return formSchema
}

export const invoke = async (schema: any, path: string, method: string, value: any) => {
  method = method.toLowerCase()
  if (["get", "delete", "options"].includes(method)){
    return invokeWithNoBody(schema, path, method, value)
  } else {
    return invokeWithBody(schema, path, method, value)
  }
}

async function invokeWithNoBody(schema: any, path: string, method: string, value: any) {
  let baseUrl = schema.schema.servers[0].url
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
  }
  const url = new URL(baseUrl + path)
  const queryStr = jsonObjToQueryStr(value)
  if (queryStr) {
    url.search = "?" + queryStr
  }
  const rawResponse = await fetch(
    url.toString(),
    {
      method: method,
      headers: {
        'Accept': 'application/json',
      }
    }
  )
  const content = await rawResponse.json()
  return content
}

async function invokeWithBody(schema: any, path: string, method: string, value: any) {
  const rawResponse = await fetch(
    schema.schema.servers[0].url,
    {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    }
  )
  const content = await rawResponse.json()
  return content
}
