import { ComponentSchemas, resolveRef } from "../../ComponentSchemas"
import JsonSchemaFieldFactory from "../../JsonSchemaFieldFactory"
import EweyFactory from "../../eweyFactory/EweyFactory"
import EweyField from "../../eweyField/EweyField"
import FieldWrapper from "../../eweyField/FieldWrapper"
import { JsonType } from "json-urley";
import TableWrapper, { Column } from "../../eweyField/TableWrapper"
import { AnySchemaObject } from "../../schemaCompiler"
import Result from "../Result"
import ResultSet from "../ResultSet"
import { ResultSetRow } from "../components/search/ResultSetRow"
import ResultSetHead from "../components/search/ResultSetHead"

export default class ResultSetFieldFactory implements EweyFactory {
  priority: number = 200

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ): EweyField<ResultSet> | undefined | null {
    let resultSchema = schema?.properties?.results?.items
    if (!resultSchema) {
      return null
    }
    resultSchema = resolveRef(resultSchema, components)
    let itemSchema = resultSchema?.properties?.item
    if (!itemSchema) {
      return null
    }
    itemSchema = resolveRef(itemSchema, components)
    if (!itemSchema.persistyStored){
      return null
    }
    const columns: Column[] = []
    for (const key of itemSchema.persistyStored.summary_attr_names) {
      const attrSchema = itemSchema.properties[key]
      columns.push({
        key,
        Field: JsonSchemaFieldFactory(attrSchema, components, ["results", "item", key], factories, [schema, itemSchema, attrSchema])
      })
    }
    const TableComponent = TableWrapper(columns, ResultSetRow, ResultSetHead) as unknown as EweyField<Result[]>

    return FieldWrapper('results', TableComponent as unknown as EweyField<JsonType>);
  }
}
