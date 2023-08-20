import { AnySchemaObject } from "../schemaCompiler";
import EweyField from "../eweyField/EweyField";

interface EweyFactory {
  priority: number;
  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ): EweyField<any> | undefined | null;
}

export default EweyFactory;
