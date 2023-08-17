import OpenApiHeaders from './OpenApiHeaders';
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
  for (const server of schema.servers) {
    const { url } = server
    if (url.endsWith('/')){
      server.url = url.substring(0, url.length - 1)
    }
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

export const headersFromToken = (token: string) => {
  const result: { [key: string]: string } = {}
  if (token) {
    result['Authorization'] = `Bearer ${token}`
  }
  return result
}

export const invoke = async (schema: any, path: string, method: string, value: any, headers: OpenApiHeaders) => {
  method = method.toLowerCase()
  if (["get", "delete", "options"].includes(method)){
    return invokeWithNoBody(schema, path, method, value, headers)
  } else {
    return invokeWithBody(schema, path, method, value, headers)
  }
}

async function invokeWithNoBody(schema: any, path: string, method: string, value: any, headers: OpenApiHeaders) {
  const url = new URL(schema.schema.servers[0].url + path)
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
        ...headers
      }
    }
  )
  const content = await rawResponse.json()
  return content
}

async function invokeWithBody(schema: any, path: string, method: string, value: any, headers: OpenApiHeaders) {
  const url = schema.schema.servers[0].url + path
  const rawResponse = await fetch(
    url,
    {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(value)
    }
  )
  const content = await rawResponse.json()
  return content
}

export const requiresAuth = (openApiMethod: any) => {
  const security = openApiMethod?.security || []
  const bearer = security.find((s: any) => Object.keys(s).includes("OAuth2PasswordBearer"))
  return !!bearer
}
