import {
  schemaCompiler,
  AnySchemaObject,
  ValidateFunction,
} from "../schemaCompiler";
import DatePickerWrapper from "../eweyField/DatePickerWrapper";
import EweyFactory from "./EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";

const FORMATS = ["date-time", "date"];

class DatePickerFactory implements EweyFactory {
  priority: number = 110;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (
      !schema ||
      schema.type !== "string" ||
      !FORMATS.includes(schema.format)
    ) {
      return null;
    }
    const validate: ValidateFunction<string> = schemaCompiler.compile(schema);
    const datePickerComponent = DatePickerWrapper(validate, schema.format);
    return datePickerComponent;
  }
}

export default DatePickerFactory;
