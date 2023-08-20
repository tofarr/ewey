import ReadOnlyWrapper from "../eweyField/ReadOnlyWrapper";
import EweyField from "../eweyField/EweyField";
import { AnySchemaObject } from "../schemaCompiler";
import EweyFactory from "./EweyFactory";

class ReadOnlyFactory implements EweyFactory {
  factory: EweyFactory;
  priority: number = 150;

  constructor(factory: EweyFactory, priority: number = 150) {
    this.factory = factory;
    this.priority = priority;
  }

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    const component = this.factory.create(
      schema,
      components,
      currentPath,
      factories,
    );
    return ReadOnlyWrapper(component as EweyField<any>);
  }
}

export default ReadOnlyFactory;
