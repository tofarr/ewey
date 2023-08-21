import FieldSetWrapper from "../eweyField/FieldSetWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import JsonSchemaComponentFactory from "../JsonSchemaComponentFactory";

class FieldSetFactory implements EweyFactory {
  inclusive: boolean = false;
  fieldNames?: string[];
  priority: number = 100;
  alwaysFullWidth?: boolean;
  labelFields?: string[]

  constructor(
    inclusive: boolean = false,
    fieldNames?: string[],
    priority: number = 100,
    alwaysFullWidth?: boolean,
    labelFields?: string[]
  ) {
    this.priority = priority;
    this.inclusive = inclusive;
    this.fieldNames = fieldNames;
    this.alwaysFullWidth = alwaysFullWidth;
    this.labelFields = labelFields;
  }

  create(
    schema: AnySchemaObject,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (!schema || schema.type !== "object") {
      return null;
    }

    const componentsByKey: any = {};
    for (const key in schema.properties) {
      if (this.includeField(key)) {
        currentPath.push(key);
        componentsByKey[key] = JsonSchemaComponentFactory(
          schema.properties[key],
          components,
          currentPath,
          factories,
        );
        currentPath.pop();
      }
    }

    let alwaysFullWidth = this.alwaysFullWidth;
    if (alwaysFullWidth == null) {
      alwaysFullWidth = false;
      if (Object.keys(componentsByKey).length !== 1){
        for (const key in componentsByKey) {
          const subSchema = schema.properties[key];
          if (!["boolean", "string", "number"].includes(subSchema.type)) {
            alwaysFullWidth = true;
            break;
          }
        }
      }
    }

    let labelFields = this.labelFields
    if (!labelFields){
      labelFields = []
      for (const key in componentsByKey) {
        const subSchema = schema.properties[key];
        if (subSchema.type === "boolean") {
          labelFields.push(key)
        }
      }
    }

    const fieldSetComponent = FieldSetWrapper(
      schema.name,
      componentsByKey,
      alwaysFullWidth,
      labelFields,
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

export default FieldSetFactory;
