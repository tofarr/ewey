import { ComponentSchemas } from "../ComponentSchemas";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import EweyFactory from "../eweyFactory/EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import ResultWrapper from "./ResultWrapper";

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
      !schema.name.endsWith("Result")
    ) {
      return null;
    }
    const itemName = schema.name.substring(0, schema.name.length - 9)
    let itemSchema = components[itemName]
    if (!itemSchema) {
      return null
    }
    const { persistyStored } = itemSchema
    if (!persistyStored){
      return null
    }
    const field = JsonSchemaFieldFactory(itemSchema, components, [...currentPath, "item"], factories, [...parents, schema])
    return ResultWrapper(field)
  }
}