import RefWrapper from "../eweyField/RefWrapper";
import { AnySchemaObject } from "../schemaCompiler";
import { ComponentSchemas } from "../ComponentSchemas";
import EweyFactory from "./EweyFactory";

class RefFactory implements EweyFactory {
  priority: number = 50;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (!schema || !schema["$ref"]) {
      return null;
    }
    const componentName = schema["$ref"].substring(13);
    return RefWrapper(
      componentName,
      components,
      currentPath.slice(),
      factories,
    );
  }
}

export default RefFactory;
