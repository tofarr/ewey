import EweyFactory from './EweyFactory';

class NamedFactory implements EweyFactory {
  name: string
  factory: EweyFactory
  priority: number = 150

  constructor(name: string, factory: EweyFactory, priority: number = 150){
    this.name = name
    this.factory = factory
    this.priority = priority
  }

  create(schema: any, factories: EweyFactory[]) {
    if (schema?.name === this.name){
      return this.factory.create(schema, factories)
    }
    return null
  }
}

export default NamedFactory
