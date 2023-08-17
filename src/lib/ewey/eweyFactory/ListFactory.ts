import ListWrapper from '../eweyField/ListWrapper';
import EweyFactory from './EweyFactory';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';
import JsonSchema from './JsonSchema'

class ListFactory implements EweyFactory {
  priority: number = 100
  createItem?: () => any

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (!schema || schema.type !== 'array' || !schema.items) {
      return null
    }
    currentPath.push('items')
    const component = JsonSchemaComponentFactory(schema.items, components, currentPath, factories)
    currentPath.pop()
    const listCompponent = ListWrapper(component, this.createItem)
    return listCompponent
  }
}

export default ListFactory
