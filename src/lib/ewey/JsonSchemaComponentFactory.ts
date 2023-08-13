import EweyFactory from './eweyFactory/EweyFactory';
import { FACTORIES } from './eweyFactory';
import JsonSchema from './eweyFactory/JsonSchema';

const JsonSchemaComponentFactory = (schema: JsonSchema, components: any, factories?: EweyFactory[]) => {
  if (!factories) {
    factories = FACTORIES
  } else {
    if (!factories.sort){
      debugger
    }
    factories.sort((a, b) => b.priority - a.priority)
  }
  for (const factory of factories) {
    const component = factory.create(schema, components, factories)
    if (component) {
      return component
    }
  }
  debugger
  throw new Error('no_factory')
}

export default JsonSchemaComponentFactory
