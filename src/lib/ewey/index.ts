import EweyFactory from './factory/EweyFactory';
import { FACTORIES } from './factory';

const Ewey = (schema: any, factories?: EweyFactory[]) => {
  if (!factories) {
    factories = FACTORIES
  } else {
    factories.sort((a, b) => b.priority - a.priority)
  }
  for (const factory of factories) {
    const component = factory.create(schema, factories)
    if (component) {
      return component
    }
  }
  throw new Error('no_factory')
}

export default Ewey
