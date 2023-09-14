import {
  AnySchemaObject,
  schemaCompiler,
  ValidateFunction,
} from "../schemaCompiler";
import EweyFactory from "./EweyFactory";
import CheckboxWrapper from "../eweyField/CheckboxWrapper";
import { ComponentSchemas } from "../ComponentSchemas";

class CheckboxFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (schema?.type !== "boolean") {
      return null;
    }
    const validate: ValidateFunction<boolean> = schemaCompiler.compile(schema);
    return CheckboxWrapper(validate);
  }
}

export default CheckboxFactory;
