import EweyFactory from "./eweyFactory/EweyFactory";
import { FACTORIES } from "./eweyFactory";
import JsonSchema from "./eweyFactory/JsonSchema";

const JsonSchemaComponentFactory = (
  schema: JsonSchema,
  components: any,
  currentPath?: string[],
  factories?: EweyFactory[],
) => {
  if (!factories) {
    factories = FACTORIES;
  } else {
    factories.sort((a, b) => b.priority - a.priority);
  }
  if (!currentPath) {
    currentPath = [];
  }
  for (const factory of factories) {
    const component = factory.create(
      schema,
      components,
      currentPath,
      factories,
    );
    if (component) {
      return component;
    }
  }
  throw new Error("no_factory");
};

export default JsonSchemaComponentFactory;
