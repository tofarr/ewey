import FieldSetWrapper from "../eweyField/FieldSetWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { newCreateDefaultFnForSchema } from "./ListFactory";
import { ComponentSchemas, resolveRef } from "../ComponentSchemas";

class FieldSetFactory implements EweyFactory {
  inclusive: boolean = false;
  fieldNames?: string[];
  priority: number = 100;

  constructor(
    inclusive: boolean = false,
    fieldNames?: string[],
    priority: number = 100
  ) {
    this.priority = priority;
    this.inclusive = inclusive;
    this.fieldNames = fieldNames;
  }

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema || schema.type !== "object") {
      return null;
    }

    // const required = schema.required || []
    const schemasByKey: any = {}
    const defaultValueFactories: any = {}
    const labelFields = []
    const fieldsByKey: any = {}
    for (const key in schema.properties) {
      if (!this.includeField(key)) {
        continue
      }

      // This logic is kinda stinky - kill it! (With fire)
      // It is designed to prevent null values - I think we should do the opposite - explicitly allow null values if missing.
      // And then filter nulls from the result.
      // That is wrong too though - we need a difference between null and undefined.
      // For example - when updating does null mean - "leave this alone" or does it mean "set this to null"
      let subSchema = schema.properties[key]
      /*
      if (!required.includes(key)){
        if (subSchema?.anyOf?.length === 2) {
          if (subSchema.anyOf[0].type === "null") {
            subSchema = {...subSchema, ...subSchema.anyOf[1]}
            delete subSchema.anyOf
          } else if (subSchema.anyOf[1].type === "null") {
            subSchema = {...subSchema, ...subSchema.anyOf[0]}
            delete subSchema.anyOf
          }
        }
      }

      Lets define this by desired behavior...
      * null and undefined are separate states.
      * a non nullable field can be undefined
      * a nullable field can be undefined
      * A text field being empty may mean...
      *   pass up an empty string
      *   pass up null
      *   do not pass up anything! (undefined)
      * 
      * There are 3 types of empty values
      *   empty strings
      *   null
      *   undefined.
      * If the field only allows one of these, we can consider every empty string or null to be that
      * If the field allows all 3, then we need to figure out a decent UI for this.
      * 
      * Maybe the label becomes a toggle button, with the rest either being "undefined" or a value.
      * Or maybe we get a select with optional fields?
      * right now what we have works but is complicated. Can we simplify?
      * 
      * Simplifications:
      *   Field does not allow blank strings but allows null - blank value should be null
      *   Field does not allow blank strings but allows undefined - blank value should be undefined
      * Cant simplify:
      *   Field does not allow blank strings but allows null or undefined - need UI to figure out which
      *   Field allows all - need UI to figure out undefined, null, or blank
      * Need a UUID field.
      */

      schemasByKey[key] = subSchema
      const factory = newCreateDefaultFnForSchema(subSchema, components)
      if (factory) {
        defaultValueFactories[key] = factory
      }
      if (subSchema.type === "boolean") {
        labelFields.push(key)
      }
      currentPath.push(key);
      fieldsByKey[key] = JsonSchemaFieldFactory(
        subSchema,
        components,
        currentPath,
        factories,
      );
      currentPath.pop();
    }

    const alwaysFullWidth = hasComplexChildren(schema, components)

    const fieldSetComponent = FieldSetWrapper(
      fieldsByKey,
      alwaysFullWidth,
      labelFields,
      schema.required || [],
      defaultValueFactories,
    );
    return fieldSetComponent;
  }

  includeField(key: string) {
    if (!this.fieldNames) {
      return true;
    }
    return this.fieldNames.includes(key) === this.inclusive;
  }
}

export const hasComplexChildren = (schema: AnySchemaObject, components: ComponentSchemas) => {
  for (const key in schema.properties) {
    const subSchema = schema.properties[key]
    if (isComplex(subSchema, components)) {
      return true
    }
  }
  return false
}

export const isComplex = (schema: AnySchemaObject, components: ComponentSchemas): boolean => {
  schema = resolveRef(schema, components)
  if (schema.enum) {
    return false
  }
  if (["boolean", "string", "number", "integer", "null"].includes(schema.type)) {
    return false
  }
  if (schema.anyOf) {
    for (const subSchema of schema.anyOf) {
      if (isComplex(subSchema, components)) {
        return true
      }
    }
    return false
  }
  if (schema.type === "object" && Object.keys(schema.properties).length === 1) {
    return isComplex(schema.properties[Object.keys(schema.properties)[0]], components)
  }
  return true
}

export default FieldSetFactory;
