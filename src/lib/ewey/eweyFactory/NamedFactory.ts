import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import { ComponentSchemas } from "./ComponentSchemas";

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
    components: ComponentSchemas,
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
