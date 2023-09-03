import ListWrapper from "../eweyField/ListWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { ComponentSchemas, resolveRef } from "../ComponentSchemas";

class ListFactory implements EweyFactory {
  priority: number = 100;
  createItem?: () => any;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema || schema.type !== "array" || !schema.items) {
      return null;
    }
    currentPath.push("items");
    const component = JsonSchemaFieldFactory(
      schema.items,
      components,
      currentPath,
      factories,
    );
    currentPath.pop();

    const createItem = newCreateDefaultFnForSchema(schema.items, components)
    const listComponent = ListWrapper(component, createItem);
    return listComponent;
  }
}


export const newCreateDefaultFnForSchema = (schema: AnySchemaObject, components: ComponentSchemas): (() => any) | undefined => {
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
  return undefined
}

export default ListFactory;
