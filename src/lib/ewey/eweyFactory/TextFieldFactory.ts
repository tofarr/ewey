import {
  schemaCompiler,
  AnySchemaObject,
  ValidateFunction,
} from "../schemaCompiler";

import TextFieldWrapper from "../eweyField/TextFieldWrapper";
import EweyFactory from "./EweyFactory";

class TextFieldFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema || schema.type !== "string") {
      return null;
    }
    const isPassword =
      currentPath.length &&
      currentPath[currentPath.length - 1].toLowerCase().indexOf("password") >=
        0;
    const type = isPassword ? "password" : "text";
    const validate: ValidateFunction<string> = schemaCompiler.compile(schema);
    const maxLength = schema.maxLength;
    const multiline =
      !schema.format && !isPassword && (!maxLength || maxLength > 255);
    const hasFocusField = components.hasFocusField;
    if (!hasFocusField) {
      components.hasFocusField = true;
    }
    const textFieldComponent = TextFieldWrapper(
      validate,
      multiline,
      type,
      "body2",
      !hasFocusField,
    );
    return textFieldComponent;
  }
}

export default TextFieldFactory;
