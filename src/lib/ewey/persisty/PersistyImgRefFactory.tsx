import EweyFactory from "../eweyFactory/EweyFactory";
import { AnySchemaObject, schemaCompiler, ValidateFunction } from "../schemaCompiler";
import { ComponentSchemas } from "../ComponentSchemas";
import PersistyImgRefWrapper from "./PersistyImgRefWrapper";

class PersistyImgRefFactory implements EweyFactory {
  priority: number = 250;
  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (!schema?.persistyImgStore) {
      return null;
    }
    const field = PersistyImgRefWrapper()
    return field;
  }
}

export default PersistyImgRefFactory;
