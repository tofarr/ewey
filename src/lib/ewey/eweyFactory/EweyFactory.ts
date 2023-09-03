import { AnySchemaObject } from "../schemaCompiler";
import EweyField from "../eweyField/EweyField";
import { ComponentSchemas } from "./ComponentSchemas";

interface EweyFactory {
  priority: number;
  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[]
  ): EweyField<any> | undefined | null;
}

export default EweyFactory;
