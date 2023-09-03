import NullableFieldWrapper from "../eweyField/NullableFieldWrapper";
import EweyFactory from "./EweyFactory";
import { AnySchemaObject } from "../schemaCompiler";
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import { newCreateDefaultFnForSchema } from "./ListFactory";
import { ComponentSchemas } from "../ComponentSchemas";

class NullableFieldFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: AnySchemaObject,
    components: ComponentSchemas,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    const anyOf = schema?.anyOf;
    if (!anyOf || anyOf.length !== 2) {
      return null;
    }
    let wrappedSchema = null;
    if (anyOf[0].type === "null") {
      wrappedSchema = anyOf[1];
    } else if (anyOf[1].type === "null") {
      wrappedSchema = anyOf[0];
    } else {
      return null;
    }
    const wrappedField = JsonSchemaFieldFactory(
      wrappedSchema,
      components,
      currentPath,
      factories,
    );
    const createItem = newCreateDefaultFnForSchema(wrappedSchema, components)
    return NullableFieldWrapper(wrappedField, createItem);
  }
}

export default NullableFieldFactory;
