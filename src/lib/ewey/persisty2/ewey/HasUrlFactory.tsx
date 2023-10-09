import {
  AnySchemaObject, ValidateFunction, schemaCompiler,
} from "../../schemaCompiler";
import EweyFactory from "../../eweyFactory/EweyFactory";
import { ComponentSchemas } from "../../ComponentSchemas";
import BelongsToWrapper from "./BelongsToWrapper";
import { toCamelCase } from "../util";
import Result from "../Result";
import HasUrlWrapper from "./HasUrlWrapper";

export default class BelongsToFactory implements EweyFactory {
  priority: number = 150;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    const { persistyHasUrl } = schema
    if (!persistyHasUrl) {
      return null
    }
    const validate: ValidateFunction<string|null> = schemaCompiler.compile(schema);
    const field = HasUrlWrapper(validate, persistyHasUrl.fileStoreName, persistyHasUrl.resizedImgUrl)
    return field;
  }
}