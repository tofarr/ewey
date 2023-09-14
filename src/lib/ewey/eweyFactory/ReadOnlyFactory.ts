import ReadOnlyWrapper from "../eweyField/ReadOnlyWrapper";
import EweyField from "../eweyField/EweyField";
import { AnySchemaObject } from "../schemaCompiler";
import EweyFactory from "./EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";

class ReadOnlyFactory implements EweyFactory {
  factory: EweyFactory;
  priority: number = 150;

  constructor(factory: EweyFactory, priority: number = 150) {
    this.factory = factory;
    this.priority = priority;
  }

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    const component = this.factory.create(
      schema,
      components,
      currentPath,
      factories,
      parents,
    );
    return ReadOnlyWrapper(component as EweyField<any>);
  }
}

export default ReadOnlyFactory;
