import {
  AnySchemaObject,
} from "../schemaCompiler";
import EweyFactory from "../eweyFactory/EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";
import BelongsToWrapper from "./BelongsToWrapper";

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
    return BelongsToWrapper(
      persistyBelongsTo.linked_store_name,
      persistyBelongsTo.label_attr_names
    );
  }
}

export default BelongsToFactory;
