import {
  schemaCompiler,
  AnySchemaObject,
  ValidateFunction,
} from "../../schemaCompiler";
import { jsonObjToQueryStr, JsonObjType, JsonType } from "json-urley";
import { createUrl } from "./OpenApi";
import OpenApiHeaders from "./OpenApiHeaders";
import OpenApiOperationSchema from "./OpenApiOperationSchema";
import OpenApiSchema from "./OpenApiSchema";
import { OpenApiOperation, OpenApiOperationFactory } from "./OpenApiOperation";

enum UrlParamsMethod {
  GET = "GET",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
}

export class UrlParamsOperation implements OpenApiOperation {
  operationId: string;
  paramsSchema: AnySchemaObject;
  resultSchema: AnySchemaObject;
  requiresAuth: boolean;
  url: string;
  method: UrlParamsMethod;
  paramsValidate: ValidateFunction<unknown> | null;
  resultValidate: ValidateFunction<unknown> | null;
  summary: string;

  constructor(
    operationId: string,
    paramsSchema: AnySchemaObject,
    resultSchema: AnySchemaObject,
    requiresAuth: boolean,
    url: string,
    method: UrlParamsMethod,
    summary: string = "",
    validateParams: boolean = true,
    validateResult: boolean = false,
  ) {
    this.operationId = operationId;
    this.paramsSchema = paramsSchema;
    this.resultSchema = resultSchema;
    this.requiresAuth = requiresAuth;
    this.url = url;
    this.method = method;
    this.summary = summary;
    this.paramsValidate = validateParams
      ? schemaCompiler.compile(this.paramsSchema)
      : null;
    this.resultValidate = validateResult
      ? schemaCompiler.compile(this.resultSchema)
      : null;
  }

  async invoke(params: JsonType, headers?: OpenApiHeaders) {
    if (!params) {
      params = {};
    }
    if (this.paramsValidate && !this.paramsValidate(params)) {
      throw new Error("invalid_params");
    }
    const parameters: JsonObjType = { ...params as JsonObjType }
    const keys = Object.keys(parameters)
    const urlStr: string = this.url.replace(/{(.*)}/g, function(match, key) {
      const present = keys.includes(key)
      if (present) {
        const value = parameters[key] + ""
        delete parameters[key]
        return value
      }
      return match;
    });
    const url = new URL(urlStr);
    const queryStr = jsonObjToQueryStr(parameters);
    if (queryStr) {
      url.search = "?" + queryStr;
    }
    const rawResponse = await fetch(url.toString(), {
      method: this.method,
      headers: {
        Accept: "application/json",
        ...(headers || {}),
      },
    });
    const result = await rawResponse.json();
    if (this.resultValidate && !this.resultValidate(result)) {
      throw new Error("invalid_result");
    }
    return result;
  }
}

export const remapReferences = (
  formSchema: AnySchemaObject,
  apiSchema: any,
) => {
  formSchema = { ...formSchema, components: apiSchema.components };
  return formSchema;
};

export const createParamsSchema = (
  operationSchema: OpenApiOperationSchema,
  apiSchema: OpenApiSchema,
) => {
  let schema: AnySchemaObject = {
    type: "object",
    name: operationSchema.operationId,
    properties: {},
    additionalProps: false
  }
  for (const param of operationSchema.parameters || []) {
    appendParam(param, schema)
  }
  schema = remapReferences(schema, apiSchema);
  return schema;
};

const appendParam = (
  param: any,
  schema: AnySchemaObject
) => {
  const required = param.required || false
  const parts = param.name.split('.')

  for (let index = 0; index < parts.length; index++) {
    const key = parts[index]
    let property = schema.properties[key];
    if (required) {
      if (!schema.required){
        schema.required = []
      }
      if (!schema.required.includes(key)) {
        schema.required.push(key)
      }
    }
    if (index < parts.length - 1) {
      if(!property) {
        property = schema.properties[key] = {
          type: "object",
          name: key,
          properties: {},
          additionalProps: false
        }
      }
      schema = schema.properties[key]
    } else {
      schema.properties[key] = param.schema
    }
  }
};

export const createResultSchema = (
  operationSchema: OpenApiOperationSchema,
  schema: OpenApiSchema,
) => {
  const result =
    operationSchema.responses["200"].content["application/json"].schema;
  const remappedResult = remapReferences(result, schema);
  return remappedResult;
};

export const requiresAuth = (operationSchema: OpenApiOperationSchema) => {
  const security = operationSchema?.security || [];
  const bearer = security.find((s: any) =>
    Object.keys(s).includes("OAuth2PasswordBearer"),
  );
  return !!bearer;
};

export class UrlParamsOperationFactory implements OpenApiOperationFactory {
  priority: number = 100;

  create(
    operationSchema: OpenApiOperationSchema,
    path: string,
    method: string,
    schema: OpenApiSchema,
  ) {
    if (!Object.values(UrlParamsMethod).includes(method as UrlParamsMethod)) {
      return null;
    }
    return new UrlParamsOperation(
      operationSchema.operationId,
      createParamsSchema(operationSchema, schema),
      createResultSchema(operationSchema, schema),
      requiresAuth(operationSchema),
      createUrl(schema, path),
      method as UrlParamsMethod,
      operationSchema.summary,
    );
  }
}
