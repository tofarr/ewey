import { TableCell } from "@mui/material"
import { ComponentSchemas, resolveRef } from "../../ComponentSchemas"
import JsonSchemaFieldFactory from "../../JsonSchemaFieldFactory"
import EweyFactory from "../../eweyFactory/EweyFactory"
import EweyField from "../../eweyField/EweyField"
import EweyProps from "../../eweyField/EweyProps"
import FieldWrapper from "../../eweyField/FieldWrapper"
import JsonType, { JsonObjectType } from "../../eweyField/JsonType"
import TableWrapper, { CellProps, Column } from "../../eweyField/TableWrapper"
import { ResultSet } from "../../persisty/ResultSet"
import { AnySchemaObject } from "../../schemaCompiler"
import Result from "../Result"
import { ResultSetCell } from "../components/search/ResultSetCell"
import { ActionField } from "../components/search/ActionField"

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
    // const ItemComponent = JsonSchemaFieldFactory(itemSchema, components, ["results", "item"], factories, [schema])
    const columns: Column[] = []
    for (const key of itemSchema.persistyStored.summary_attr_names) {
      const attrSchema = itemSchema.properties[key]
      columns.push({
        key,
        Field: JsonSchemaFieldFactory(attrSchema, components, ["results", "item", key], factories, [schema, itemSchema, attrSchema])
      })
    }
    const TableComponent = TableWrapper(columns, ResultSetCell, ActionField as unknown as EweyField<JsonObjectType>) as unknown as EweyField<Result[]>

    return FieldWrapper('results', TableComponent as unknown as EweyField<JsonType>);
  }
}
