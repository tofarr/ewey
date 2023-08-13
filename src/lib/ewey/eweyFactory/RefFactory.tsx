import RefWrapper from '../eweyComponent/RefWrapper';
import EweyFactory from './EweyFactory';
import JsonSchema from './../eweyFactory/JsonSchema';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';


class RefFactory implements EweyFactory {
  priority: number = 50

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    if (!schema || !schema["$ref"]) {
      return null
    }
    const componentName = schema["$ref"].substring(13)
    return RefWrapper(componentName, components, factories)
  }
}

export default RefFactory
