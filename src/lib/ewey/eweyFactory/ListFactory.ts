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
    const listComponent = ListWrapper(component, this.createItem);
    return listComponent;
  }
}

export default ListFactory;
