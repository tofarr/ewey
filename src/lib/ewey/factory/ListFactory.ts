import ListWrapper from '../component/ListWrapper';
import EweyFactory from './EweyFactory';
import Ewey from '../';

class ListFactory implements EweyFactory {
  priority: number = 100
  createItem?: () => any

  create(schema: any, factories: EweyFactory[]) {
    if (!schema || schema.type !== 'array' || !schema.items) {
      return null
    }
    const component = Ewey(schema.items, factories)
    const listCompponent = ListWrapper(component, this.createItem)
    return listCompponent
  }
}

export default ListFactory
