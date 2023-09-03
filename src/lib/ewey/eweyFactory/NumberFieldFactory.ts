import {
  schemaCompiler,
  AnySchemaObject,
  ValidateFunction,
} from "../schemaCompiler";

import NumberFieldWrapper from "../eweyField/NumberFieldWrapper";
import EweyFactory from "./EweyFactory";
import { ComponentSchemas } from "./ComponentSchemas";

const NUMBER_TYPES = ["integer", "number"];

class NumberFieldFactory implements EweyFactory {
  priority: number = 110;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!NUMBER_TYPES.includes(schema.type)) {
      return null;
    }
    const validate: ValidateFunction<number> = schemaCompiler.compile(schema);
    const textFieldComponent = NumberFieldWrapper(validate);
    return textFieldComponent;
  }
}

export default NumberFieldFactory;
