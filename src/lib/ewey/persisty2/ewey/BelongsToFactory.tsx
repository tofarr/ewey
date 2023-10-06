import {
  AnySchemaObject, ValidateFunction, schemaCompiler,
} from "../../schemaCompiler";
import EweyFactory from "../../eweyFactory/EweyFactory";
import { ComponentSchemas } from "../../ComponentSchemas";
import BelongsToWrapper from "./BelongsToWrapper";
import { toCamelCase } from "../util";
import Result from "../Result";

class BelongsToFactory implements EweyFactory {
  priority: number = 150;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    const persistyBelongsTo = schema?.persistyBelongsTo;
    if (!persistyBelongsTo) {
      return null;
    }
    const validate: ValidateFunction<string|null> = schemaCompiler.compile(schema);
    const linkedComponent = components[toCamelCase(persistyBelongsTo.linked_store_name)]
    const labelAttrNames = linkedComponent?.persistyStored?.label_attr_names
    if (!labelAttrNames?.length){
      return null
    }
    const labelExtractor = (result: Result) => labelAttrNames.map((a: string) => result.item[a] as string).join(" ")
    return BelongsToWrapper(
      persistyBelongsTo.linked_store_name,
      validate,
      labelExtractor
    );
  }
}

export default BelongsToFactory;
