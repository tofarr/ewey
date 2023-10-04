import {
  AnySchemaObject, ValidateFunction, schemaCompiler,
} from "../schemaCompiler";
import EweyFactory from "../eweyFactory/EweyFactory";
import { ComponentSchemas } from "../ComponentSchemas";
// import BelongsToWrapper from "./BelongsToWrapper";
import { JsonObjectType } from "../eweyField/JsonType";
import { toCamelCase } from "./util";
/*
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
    if (!linkedComponent){
      return null
    }
    const keyConfig = linkedComponent.key_config || []
    if(keyConfig[0] !== "AttrKeyConfig"){
      return null
    }
    const labelAttrNames = linkedComponent.label_attr_names
    if (!labelAttrNames?.length){
      return null
    }
    const keyAttrName = keyConfig[1].attr_name
    const keyExtractor = (item: JsonObjectType) => item[keyAttrName] as string
    const labelExtractor = (item: JsonObjectType) => labelAttrNames.map((a: string) => item[a] as string).join(" ")
    return BelongsToWrapper(
      persistyBelongsTo.linked_store_name,
      validate,
      keyExtractor,
      labelExtractor
    );
  }
}

export default BelongsToFactory;
*/