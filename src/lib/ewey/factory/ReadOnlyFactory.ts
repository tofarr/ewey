import ReadOnlyWrapper from '../component/ReadOnlyWrapper';
import EweyComponent from '../component/EweyComponent';
import EweyFactory from './EweyFactory';

class ReadOnlyFactory implements EweyFactory {
  factory: EweyFactory
  priority: number = 150

  constructor(factory: EweyFactory, priority: number = 150){
    this.factory = factory
    this.priority = priority
  }

  create(schema: any, factories: EweyFactory[]) {
    const component = this.factory.create(schema, factories)
    return ReadOnlyWrapper(component as EweyComponent<any>)
  }
}

export default ReadOnlyFactory
