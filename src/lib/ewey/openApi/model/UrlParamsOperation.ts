import { schemaCompiler, AnySchemaObject, ValidateFunction } from "../../schemaCompiler";
import { jsonObjToQueryStr, JsonType } from "json-urley";
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
      throw new Error('invalid_params')
    }
    const url = new URL(this.url);
    const queryStr = jsonObjToQueryStr(params);
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
      throw new Error('invalid_result')
    }
    return result;
  }
}

export const remapReferences = (formSchema: AnySchemaObject, apiSchema: any) => {
  formSchema = { ...formSchema, components: apiSchema.components };
  return formSchema;
};

export const createParamsSchema = (
  operationSchema: OpenApiOperationSchema,
  apiSchema: OpenApiSchema,
) => {
  const properties: any = {};
  const required: string[] = [];
  for (const param of operationSchema.parameters || []) {
    if (param.required) {
      required.push(param.name);
    }
    properties[param.name] = param.schema;
  }
  let result: AnySchemaObject = {
    type: "object",
    name: operationSchema.operationId,
    properties,
    required,
  };
  result = remapReferences(result, apiSchema);
  return result;
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
