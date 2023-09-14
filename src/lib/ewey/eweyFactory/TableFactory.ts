import TableWrapper from "../eweyField/TableWrapper";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { AnySchemaObject } from "../schemaCompiler";
import { ComponentSchemas } from "../ComponentSchemas";
import EweyFactory from "./EweyFactory";
import EweyField from "../eweyField/EweyField";

class TableFactory implements EweyFactory {
  priority: number;
  restrictToKeys: string[] | null;
  pathMatch: string[] | null;
  actionField?: EweyField<any> | null

  constructor(
    priority: number = 110,
    restrictToKeys: string[] | null = null,
    pathMatch: string[] | null = null,
    actionField?: EweyField<any> | null
  ) {
    this.priority = priority;
    this.restrictToKeys = restrictToKeys;
    this.pathMatch = pathMatch;
    this.actionField = actionField
  }

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
    parents: AnySchemaObject[],
  ) {
    if (!schema || schema.type !== "array") {
      return null;
    }
    let { items } = schema;
    const ref = items["$ref"];
    if (ref) {
      items = components[ref.split("/components/")[1]];
    }
    if (!items || items.type !== "object") {
      return null;
    }
    if (this.pathMatch) {
      if (this.pathMatch.length !== currentPath.length) {
        return null;
      }
      for (let i = 0; i < this.pathMatch.length; i++) {
        if (this.pathMatch[i] !== currentPath[i]) {
          return null;
        }
      }
    }
    const { properties } = items;
    const columns = [];
    if (this.restrictToKeys) {
      for (const key in properties) {
        if (this.restrictToKeys.includes(key)) {
          currentPath.push(key);
          columns.push({
            key,
            Field: JsonSchemaFieldFactory(
              properties[key],
              components,
              currentPath,
              factories,
            ),
          });
          currentPath.pop();
        }
      }
    } else {
      for (const key in properties) {
        const types = getTypes(properties[key], components);
        if (types.includes("object") || types.includes("array")) {
          return null;
        }
        currentPath.push(key);
        columns.push({
          key,
          Field: JsonSchemaFieldFactory(
            properties[key],
            components,
            currentPath,
            factories,
          ),
        });
        currentPath.pop();
      }
    }

    return TableWrapper(columns, this.actionField);
  }
}

function getTypes(schema: AnySchemaObject, components: ComponentSchemas): string[] {
  if (schema.anyOf) {
    const result: string[] = [];
    for (const s of schema.anyOf) {
      result.push.apply(result, getTypes(s, components));
    }
    return result;
  }
  if (schema['$ref']) {
    const componentName = schema["$ref"].substring(13);
    const referencedSchema = components[componentName];
    return getTypes(referencedSchema, components);
  }
  if(schema.enum){
    return ["string"];
  }
  return [schema.type.toLowerCase()];
}

export default TableFactory;
