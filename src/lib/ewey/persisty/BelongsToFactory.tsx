import {
  AnySchemaObject, ValidateFunction, schemaCompiler,
} from "../schemaCompiler";
import EweyFactory from "../eweyFactory/EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";
import BelongsToWrapper from "./BelongsToWrapper";
import { JsonObjectType } from "../eweyField/JsonType";
import { ItemLabelProps } from "./SelectOneSearchDialog";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";

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
    const keyExtractor = (item: JsonObjectType) => item.id as string
    const labelExtractor = (item: JsonObjectType) => item.title as string

    return BelongsToWrapper(
      persistyBelongsTo.linked_store_name,
      validate,
      keyExtractor,
      labelExtractor
    );
  }
}

export default BelongsToFactory;
