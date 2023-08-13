import ReadOnlyWrapper from '../eweyComponent/ReadOnlyWrapper';
import EweyComponent from '../eweyComponent/EweyComponent';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class ReadOnlyFactory implements EweyFactory {
  factory: EweyFactory
  priority: number = 150

  constructor(factory: EweyFactory, priority: number = 150){
    this.factory = factory
    this.priority = priority
  }

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    const component = this.factory.create(schema, components, factories)
    return ReadOnlyWrapper(component as EweyComponent<any>)
  }
}

export default ReadOnlyFactory
