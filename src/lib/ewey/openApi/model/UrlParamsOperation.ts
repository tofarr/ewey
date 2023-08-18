import { Validator } from "@cfworker/json-schema";
import { jsonObjToQueryStr } from "json-urley";
import JsonSchema from "../../eweyFactory/JsonSchema";
import JsonType from "../../eweyField/JsonType";
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
  paramsSchema: JsonSchema;
  resultSchema: JsonSchema;
  requiresAuth: boolean;
  url: string;
  method: UrlParamsMethod;
  paramsValidator: Validator | null;
  resultValidator: Validator | null;
  summary: string;

  constructor(
    operationId: string,
    paramsSchema: JsonSchema,
    resultSchema: JsonSchema,
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
    this.paramsValidator = validateParams
      ? new Validator(this.paramsSchema)
      : null;
    this.resultValidator = validateResult
      ? new Validator(this.resultSchema)
      : null;
  }

  async invoke(params: JsonType, headers?: OpenApiHeaders) {
    if (!params) {
      params = {};
    }
    validate(this.paramsValidator, params, "invalid_params");
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
    validate(this.resultValidator, result, "invalid_result");
    return result;
  }
}

export const validate = (
  validator: Validator | null,
  value: JsonType,
  errorMessage: string,
) => {
  if (validator) {
    const validationResult = validator.validate(value);
    if (!validationResult.valid) {
      throw new Error(errorMessage);
    }
  }
};

export const remapReferences = (formSchema: JsonSchema, apiSchema: any) => {
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
  let result = {
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
