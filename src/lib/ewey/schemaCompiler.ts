import addFormats from "ajv-formats";
import Ajv from "ajv";
export type { AnySchemaObject, ValidateFunction } from "ajv";

export const schemaCompiler = new Ajv({ strict: false });
addFormats(schemaCompiler);

export { Ajv };
