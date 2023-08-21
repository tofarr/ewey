import { v4 as uuidv4 } from "uuid";
import ListWrapper from "../eweyField/ListWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import JsonSchemaComponentFactory from "../JsonSchemaComponentFactory";

class ListFactory implements EweyFactory {
  priority: number = 100;
  createItem?: () => any;

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema || schema.type !== "array" || !schema.items) {
      return null;
    }
    currentPath.push("items");
    const component = JsonSchemaComponentFactory(
      schema.items,
      components,
      currentPath,
      factories,
    );
    currentPath.pop();

    const createItem = newCreateDefaultFnForSchema(schema.items, components)
    const listComponent = ListWrapper(component, this.createItem);
    return listComponent;
  }
}


export const newCreateDefaultFnForSchema = (schema: AnySchemaObject, components: any): (() => any) | undefined => {
  if (schema.default) {
    return () => schema.default
  }
  if (schema["$ref"]) {
    const componentName = schema["$ref"].substring(13);
    return newCreateDefaultFnForSchema(components[componentName], components)
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
    if (!schema.format) {
      return () => ''
    }
    if (schema.format === 'date-time') {
      return () => new Date().toISOString()
    }
    if (schema.format === 'uuid') {
      return uuidv4
    }
  }
  return undefined
}

export default ListFactory;
