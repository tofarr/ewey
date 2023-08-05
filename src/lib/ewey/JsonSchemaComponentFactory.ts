import EweyFactory from './eweyFactory/EweyFactory';
import { FACTORIES } from './eweyFactory';
import JsonSchema from './eweyFactory/JsonSchema';

const JsonSchemaComponentFactory = (schema: JsonSchema, components: any, factories?: EweyFactory[]) => {
  if (!factories) {
    factories = FACTORIES
  } else {
    factories.sort((a, b) => b.priority - a.priority)
  }
  for (const factory of factories) {
    const component = factory.create(schema, factories, components)
    if (component) {
      return component
    }
  }
  throw new Error('no_factory')
}

export default JsonSchemaComponentFactory
