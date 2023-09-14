import FieldSetWrapper from "../eweyField/FieldSetWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject, newCreateDefaultFnForSchema } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { ComponentSchemas, resolveRef } from "../ComponentSchemas";

class FieldSetFactory implements EweyFactory {
  inclusive: boolean = false;
  fieldNames?: string[];
  priority: number = 100;

  constructor(
    inclusive: boolean = false,
    fieldNames?: string[],
    priority: number = 100
  ) {
    this.priority = priority;
    this.inclusive = inclusive;
    this.fieldNames = fieldNames;
  }

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (!schema || schema.type !== "object") {
      return null;
    }

    // const required = schema.required || []
    const schemasByKey: any = {}
    const defaultValueFactories: any = {}
    const labelFields = []
    const fieldsByKey: any = {}
    for (const key in schema.properties) {
      if (!this.includeField(key)) {
        continue
      }

      let subSchema = schema.properties[key]
      schemasByKey[key] = subSchema
      const factory = newCreateDefaultFnForSchema(subSchema, components)
      if (factory) {
        defaultValueFactories[key] = factory
      }
      if (subSchema.type === "boolean") {
        labelFields.push(key)
      }
      currentPath.push(key);
      fieldsByKey[key] = JsonSchemaFieldFactory(
        subSchema,
        components,
        currentPath,
        factories,
      );
      currentPath.pop();
    }

    const alwaysFullWidth = hasComplexChildren(schema, components)

    const fieldSetComponent = FieldSetWrapper(
      fieldsByKey,
      alwaysFullWidth,
      labelFields,
      schema.required || [],
      defaultValueFactories,
    );
    return fieldSetComponent;
  }

  includeField(key: string) {
    if (!this.fieldNames) {
      return true;
    }
    return this.fieldNames.includes(key) === this.inclusive;
  }
}

export const hasComplexChildren = (schema: AnySchemaObject, components: ComponentSchemas) => {
  for (const key in schema.properties) {
    const subSchema = schema.properties[key]
    if (isComplex(subSchema, components)) {
      return true
    }
  }
  return false
}

export const isComplex = (schema: AnySchemaObject, components: ComponentSchemas): boolean => {
  schema = resolveRef(schema, components)
  if (schema.enum) {
    return false
  }
  if (["boolean", "string", "number", "integer", "null"].includes(schema.type)) {
    return false
  }
  if (schema.anyOf) {
    for (const subSchema of schema.anyOf) {
      if (isComplex(subSchema, components)) {
        return true
      }
    }
    return false
  }
  if (schema.type === "object" && Object.keys(schema.properties).length === 1) {
    return isComplex(schema.properties[Object.keys(schema.properties)[0]], components)
  }
  return true
}

export default FieldSetFactory;
