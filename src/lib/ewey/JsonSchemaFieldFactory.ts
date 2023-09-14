import EweyFactory from "./eweyFactory/EweyFactory";
import { FACTORIES } from "./eweyFactory";
import { AnySchemaObject } from "./schemaCompiler";

const JsonSchemaFieldFactory = (
  schema: AnySchemaObject,
  components?: any,
  currentPath?: string[],
  factories?: EweyFactory[],
  parents?: AnySchemaObject[],
) => {
  if (!currentPath) {
    currentPath = [];
  }
  if (!factories) {
    factories = FACTORIES;
  } else {
    factories.sort((a, b) => b.priority - a.priority);
  }
  if (!parents) {
    parents = []
  }
  for (const factory of factories) {
    const component = factory.create(
      schema,
      components,
      currentPath,
      factories,
      parents,
    );
    if (component) {
      return component;
    }
  }
  throw new Error("no_factory");
};

export default JsonSchemaFieldFactory;
