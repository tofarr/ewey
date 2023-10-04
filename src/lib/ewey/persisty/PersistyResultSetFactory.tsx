import { ComponentSchemas } from "../ComponentSchemas";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import EweyFactory from "../eweyFactory/EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import { PersistyActionsWrapper } from "./PersistyActions";
import PersistyResultSetWrapper from "./PersistyResultSetWrapper";

class PersistyResultSetFactory implements EweyFactory {
  priority: number = 110;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (
      !schema ||
      schema.type !== "object" ||
      !schema.name ||
      !schema.name.endsWith("ResultSet")
    ) {
      return null;
    }
    const itemName = schema.name.substring(0, schema.name.length - 9)
    let itemSchema = components[itemName]
    if (!itemSchema) {
      return null
    }
    const { persistyStored } = itemSchema
    const columns = persistyStored.summary_attr_names.map((key: string) => (
      {
        key,
        Field: JsonSchemaFieldFactory(
          itemSchema.properties[key],
          components,
          currentPath,
          factories,
        ),
      }
    ))
    const storeName = persistyStored.store_name
    const actionField = PersistyActionsWrapper(storeName)
    const result = PersistyResultSetWrapper(columns, actionField)
    return result
  }
}

export default PersistyResultSetFactory;
