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
  ) {
    if (!schema?.persistyImgStore) {
      return null;
    }
    console.log("TRACE", schema)
    const field = PersistyImgRefWrapper()
    return field;
  }
}

export default PersistyImgRefFactory;
