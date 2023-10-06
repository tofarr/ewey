import { ComponentSchemas, resolveRef } from "../../ComponentSchemas"
import JsonSchemaFieldFactory from "../../JsonSchemaFieldFactory"
import EweyFactory from "../../eweyFactory/EweyFactory"
import EweyField from "../../eweyField/EweyField"
import FieldWrapper from "../../eweyField/FieldWrapper"
import { AnySchemaObject } from "../../schemaCompiler"
import Result from "../Result"

export default class ResultFieldFactory implements EweyFactory {
  priority: number = 200

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ): EweyField<Result> | undefined | null {
    let itemSchema = schema?.properties?.item
    if (!itemSchema) {
      return null
    }
    itemSchema = resolveRef(itemSchema, components)
    if (!itemSchema.persistyStored){
      return null
    }
    const ItemComponent = JsonSchemaFieldFactory(itemSchema, components, ["item"], factories, [schema])
    return FieldWrapper<Result>('item', ItemComponent)
  }
}
