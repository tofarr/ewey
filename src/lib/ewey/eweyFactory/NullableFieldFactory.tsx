import NullableFieldWrapper from '../eweyComponent/NullableFieldWrapper';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';

class NullableFieldFactory implements EweyFactory {
  priority: number = 100

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    const anyOf = schema?.anyOf
    if (!anyOf || anyOf.length !== 2) {
      return null
    }
    let wrappedSchema = null
    if (anyOf[0].type === "null") {
      wrappedSchema = anyOf[1]
    } else if (anyOf[1].type === "null") {
      wrappedSchema = anyOf[0]
    } else {
      return null
    }
    const wrappedField = JsonSchemaComponentFactory(wrappedSchema, components, factories)
    return NullableFieldWrapper(wrappedField)
  }
}

export default NullableFieldFactory