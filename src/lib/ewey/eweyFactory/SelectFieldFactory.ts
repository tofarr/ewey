import EweyFactory from "./EweyFactory";
import { AnySchemaObject, schemaCompiler, ValidateFunction } from "../schemaCompiler";
import SelectFieldWrapper from "../eweyField/SelectFieldWrapper";
import { ComponentSchemas } from "../ComponentSchemas";

class SelectFieldFactory implements EweyFactory {
  priority: number = 100;
  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
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
