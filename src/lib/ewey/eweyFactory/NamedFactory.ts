import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class NamedFactory implements EweyFactory {
  name: string
  factory: EweyFactory
  priority: number = 150

  constructor(name: string, factory: EweyFactory, priority: number = 150){
    this.name = name
    this.factory = factory
    this.priority = priority
  }

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    if (schema?.name === this.name){
      return this.factory.create(schema, factories, components)
    }
    return null
  }
}

export default NamedFactory
