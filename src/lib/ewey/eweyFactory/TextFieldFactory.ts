import {
  schemaCompiler,
  AnySchemaObject,
  ValidateFunction,
} from "../schemaCompiler";

import TextFieldWrapper from "../eweyField/TextFieldWrapper";
import EweyFactory from "./EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";

class TextFieldFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
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
    const textFieldComponent = TextFieldWrapper(
      validate,
      multiline,
      type,
      "body2",
    );
    return textFieldComponent;
  }
}

export default TextFieldFactory;
