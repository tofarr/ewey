import EweyFactory from "../eweyFactory/EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import { ComponentSchemas } from "../ComponentSchemas";
// import PersistyImgRefWrapper from "./PersistyImgRefWrapper";

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
    //const { store_name } = schema.persistyImgStore
    //const field = PersistyImgRefWrapper(store_name)
    //return field;
    return null
  }
}

export default PersistyImgRefFactory;
