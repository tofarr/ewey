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
import DataResultSetRow from "../components/data/DataResultSetRow"
import DataResultSetHead from "../components/data/DataResultSetHead"

export default class DataResultSetFieldFactory implements EweyFactory {
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
    if (!itemSchema.persistyData){
      return null
    }
    const itemProperties = itemSchema.properties
    const {file_name, updated_at} = itemProperties
    const columns: Column[] = [
      {key: "updated_at", Field: JsonSchemaFieldFactory(updated_at, components, ["results", "item", "updated_at"], factories, [schema, itemSchema, updated_at])}
    ]
    const TableComponent = TableWrapper(columns, DataResultSetRow, DataResultSetHead) as unknown as EweyField<Result[]>
    return FieldWrapper('results', TableComponent as unknown as EweyField<JsonType>);
  }
}
