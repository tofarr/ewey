import CheckboxComponent from '../eweyComponent/CheckboxComponent';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class CheckboxFactory implements EweyFactory {
  priority: number = 100

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (schema?.type !== 'boolean'){
      return null
    }
    return CheckboxComponent
  }
}

export default CheckboxFactory
