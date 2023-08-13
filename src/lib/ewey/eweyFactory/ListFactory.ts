import ListWrapper from '../eweyComponent/ListWrapper';
import EweyFactory from './EweyFactory';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';
import JsonSchema from './JsonSchema'

class ListFactory implements EweyFactory {
  priority: number = 100
  createItem?: () => any

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    if (!schema || schema.type !== 'array' || !schema.items) {
      return null
    }
    const component = JsonSchemaComponentFactory(schema.items, components, factories)
    const listCompponent = ListWrapper(component, this.createItem)
    return listCompponent
  }
}

export default ListFactory
