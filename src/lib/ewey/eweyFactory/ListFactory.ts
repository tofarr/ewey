import ListWrapper from '../eweyComponent/ListWrapper';
import EweyFactory from './EweyFactory';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';

class ListFactory implements EweyFactory {
  priority: number = 100
  createItem?: () => any

  create(schema: any, factories: EweyFactory[]) {
    if (!schema || schema.type !== 'array' || !schema.items) {
      return null
    }
    const component = JsonSchemaComponentFactory(schema.items, factories)
    const listCompponent = ListWrapper(component, this.createItem)
    return listCompponent
  }
}

export default ListFactory
