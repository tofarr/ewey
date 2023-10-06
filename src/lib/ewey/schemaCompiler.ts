import addFormats from "ajv-formats";
import Ajv, { AnySchemaObject } from "ajv";
import { v4 as uuidv4 } from "uuid";
import { JsonObjType, JsonType } from "json-urley";
import { ComponentSchemas, resolveRef } from "./ComponentSchemas";

export type { AnySchemaObject, ValidateFunction } from "ajv";

export const schemaCompiler = new Ajv({ strict: false });
addFormats(schemaCompiler);

export const newCreateDefaultFnForSchema = (schema: AnySchemaObject, components: ComponentSchemas): (() => JsonType) | undefined => {
  if (schema.default) {
    return () => schema.default
  }
  if (schema["$ref"]) {
    const referencedSchema = resolveRef(schema, components)
    return newCreateDefaultFnForSchema(referencedSchema, components)
  }
  if (schema.enum) {
    return () => schema.enum[0]
  }
  if (schema.type === 'boolean') {
    return () => false
  }
  if (["number", "integer"].includes(schema.type)) {
    return () => 0
  }
  if (schema.type === 'null') {
    return () => null
  }
  if (schema.type === 'string') {
    if (schema.format === 'date-time') {
      return () => new Date().toISOString()
    }
    if (schema.format === 'uuid') {
      return uuidv4
    }
    return () => ''
  }
  if (schema.type === 'object') {
    return () => {
      const result: any = {}
      const required = schema.required || []
      for (const key in schema.properties) {
        if (required.includes(key)) {
          const fn = newCreateDefaultFnForSchema(schema.properties[key], components)
          if (fn !== undefined) {
            result[key] = fn()
          }
        }
      }
      return result
    }
  }
  if (schema.anyOf) {
    const subSchema = schema.anyOf.find((s: JsonObjType) => s.type !== "null")
    if (subSchema){
      return newCreateDefaultFnForSchema(subSchema, components)
    }
  }
  return undefined
}


export { Ajv };
