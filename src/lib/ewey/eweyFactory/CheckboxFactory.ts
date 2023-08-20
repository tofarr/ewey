import {
  AnySchemaObject,
  schemaCompiler,
  ValidateFunction,
} from "../schemaCompiler";
import EweyFactory from "./EweyFactory";
import CheckboxWrapper from "../eweyField/CheckboxWrapper";


class CheckboxFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (schema?.type !== "boolean") {
      return null;
    }
    const validate: ValidateFunction<boolean> = schemaCompiler.compile(schema);
    return CheckboxWrapper(validate);
  }
}

export default CheckboxFactory;
