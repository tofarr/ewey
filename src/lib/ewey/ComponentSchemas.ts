import { AnySchemaObject } from "ajv";


export interface ComponentSchemas {
  [key: string]: AnySchemaObject;
}

export function getComponentName(ref: string) {
  const componentName = ref.substring(13);
  return componentName
}

export function resolveRef(schema: AnySchemaObject, components: ComponentSchemas): AnySchemaObject {
  const ref = schema["$ref"];
  if (!ref) {
    return schema
  }
  const result = components[getComponentName(ref)]
  if (!result) {
    throw new Error(`unknown_ref:${ref}`)
  }
  return result
}