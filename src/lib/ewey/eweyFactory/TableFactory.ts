import TableWrapper from "../eweyField/TableWrapper";
import JsonSchemaComponentFactory from "../JsonSchemaComponentFactory";
import EweyFactory from "./EweyFactory";
import JsonSchema from "./JsonSchema";

class TableFactory implements EweyFactory {
  priority: number;
  restrictToKeys: string[] | null;
  pathMatch: string[] | null;

  constructor(
    priority: number = 110,
    restrictToKeys: string[] | null = null,
    pathMatch: string[] | null = null,
  ) {
    this.priority = priority;
    this.restrictToKeys = restrictToKeys;
    this.pathMatch = pathMatch;
  }

  create(
    schema: JsonSchema,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
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
            Field: JsonSchemaComponentFactory(
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
        const types = getTypes(properties[key]);
        if (types.includes("object") || types.includes("array")) {
          return null;
        }
        currentPath.push(key);
        columns.push({
          key,
          Field: JsonSchemaComponentFactory(
            properties[key],
            components,
            currentPath,
            factories,
          ),
        });
        currentPath.pop();
      }
    }
    return TableWrapper(columns);
  }
}

function getTypes(schema: JsonSchema) {
  if (schema.anyOf) {
    const result: string[] = [];
    for (const s of schema.anyOf) {
      result.push.apply(result, getTypes(s));
    }
    return result;
  }
  return [schema.type.toLowerCase()];
}

export default TableFactory;
