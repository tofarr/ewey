import RefWrapper from "../eweyField/RefWrapper";
import EweyFactory from "./EweyFactory";
import JsonSchema from "../eweyFactory/JsonSchema";

class RefFactory implements EweyFactory {
  priority: number = 50;

  create(
    schema: JsonSchema,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
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
