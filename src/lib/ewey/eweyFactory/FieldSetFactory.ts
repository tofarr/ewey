import FieldSetWrapper from "../eweyField/FieldSetWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject, newCreateDefaultFnForSchema } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { ComponentSchemas, resolveRef } from "../ComponentSchemas";

class FieldSetFactory implements EweyFactory {
  inclusive: boolean;
  fieldNames?: string[];
  maxOptionalFieldsForSelect: number;
  priority: number;

  constructor(
    inclusive: boolean = false,
    fieldNames?: string[],
    priority: number = 100,
    maxOptionalFieldsForSelect = 3
  ) {
    this.priority = priority;
    this.inclusive = inclusive;
    this.fieldNames = fieldNames;
    this.maxOptionalFieldsForSelect = maxOptionalFieldsForSelect;
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

    // Maybe if the fieldset has fields that are both optional and nullable, we use a dropdown?
    // Or if it has more than a certain number of optional fields, we use a dropdown

    const required = schema.required || []
    const schemasByKey: any = {}
    const defaultValueFactories: any = {}
    const labelFields = []
    const fieldsByKey: any = {}
    for (const key in schema.properties) {
      if (!this.includeField(key)) {
        continue
      }

      let subSchema = schema.properties[key]
      subSchema = unwrapOptional(key, subSchema, required)
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
    const selectOptional = Object.keys(fieldsByKey).length - required.length > this.maxOptionalFieldsForSelect;

    const fieldSetComponent = FieldSetWrapper(
      fieldsByKey,
      alwaysFullWidth,
      labelFields,
      required,
      defaultValueFactories,
      selectOptional,
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

export function hasComplexChildren(schema: AnySchemaObject, components: ComponentSchemas) {
  for (const key in schema.properties) {
    const subSchema = schema.properties[key]
    if (isComplex(subSchema, components)) {
      return true
    }
  }
  return false
}

export function isComplex(schema: AnySchemaObject, components: ComponentSchemas): boolean {
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

export function unwrapOptional(key: string, schema: AnySchemaObject, required: string[]) {
  if (schema.default !== null || required.includes(key)){
    return schema
  }
  const anyOf = schema.anyOf;
  if (anyOf?.length !== 2){
    return schema
  }
  if (anyOf[0].type === 'null'){
    return anyOf[1]
  }
  if (anyOf[1].type === 'null'){
    return anyOf[0]
  }
  return schema
}

export default FieldSetFactory;
