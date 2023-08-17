import CheckboxField from '../eweyField/CheckboxField';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class CheckboxFactory implements EweyFactory {
  priority: number = 100

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (schema?.type !== 'boolean'){
      return null
    }
    return CheckboxField
  }
}

export default CheckboxFactory
