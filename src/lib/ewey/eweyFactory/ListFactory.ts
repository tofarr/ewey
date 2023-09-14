import ListWrapper from "../eweyField/ListWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject, newCreateDefaultFnForSchema } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { ComponentSchemas } from "../ComponentSchemas";

class ListFactory implements EweyFactory {
  priority: number = 100;
  createItem?: () => any;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
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

export default ListFactory;
