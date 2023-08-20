import RefWrapper from "../eweyField/RefWrapper";
import { AnySchemaObject } from "../schemaCompiler";
import EweyFactory from "./EweyFactory";

class RefFactory implements EweyFactory {
  priority: number = 50;

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    console.log("Well dang...");
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
