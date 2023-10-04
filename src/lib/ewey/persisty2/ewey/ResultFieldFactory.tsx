import { ComponentSchemas } from "../../ComponentSchemas";
import JsonSchemaFieldFactory from "../../JsonSchemaFieldFactory";
import EweyFactory from "../../eweyFactory/EweyFactory";
import { AnySchemaObject } from "../../schemaCompiler";
import ResultFieldWrapper from "./ResultFieldWrapper";


class ResultFieldFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    const itemSchema = this.getItemSchema(schema, components)
    if (!itemSchema) {
      return null;
    }
    const itemComponent = JsonSchemaFieldFactory(itemSchema, components, [...currentPath, "item"], factories, [...parents, schema])
    return ResultFieldWrapper(itemSchema.persistyStored.store_name, itemComponent)
  }

  getItemSchema(schema: AnySchemaObject, components: ComponentSchemas) {
    if (!schema){
      return null
    }
    if (schema.type !== "object"){
      return null
    }
    if (!(schema.name || "").endsWith("Result")) {
      return null
    }
    const itemName = schema.name.substring(0, schema.name.length - 6)
    const itemSchema = components[itemName]
    if (!itemSchema.persistyStored){
      return null
    }
    return itemSchema
  }
}

export default ResultFieldFactory;
