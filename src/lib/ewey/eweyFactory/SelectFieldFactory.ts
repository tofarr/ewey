import EweyFactory from "./EweyFactory";
import { AnySchemaObject, schemaCompiler, ValidateFunction } from "../schemaCompiler";
import SelectFieldWrapper from "../eweyField/SelectFieldWrapper";

class SelectFieldFactory implements EweyFactory {
  priority: number = 100;
  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema?.enum) {
      return null;
    }
    const validate: ValidateFunction<string> = schemaCompiler.compile(schema);
    const SelectField = SelectFieldWrapper(validate, schema.enum)
    return SelectField;
  }
}

export default SelectFieldFactory;
