import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";

class NamedFactory implements EweyFactory {
  name: string;
  factory: EweyFactory;
  priority: number = 150;

  constructor(name: string, factory: EweyFactory, priority: number = 150) {
    this.name = name;
    this.factory = factory;
    this.priority = priority;
  }

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (schema?.name === this.name) {
      return this.factory.create(schema, components, currentPath, factories);
    }
    return null;
  }
}

export default NamedFactory;
