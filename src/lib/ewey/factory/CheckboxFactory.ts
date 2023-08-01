import CheckboxComponent from '../component/CheckboxComponent';
import EweyFactory from './EweyFactory';

class CheckboxFactory implements EweyFactory {
  priority: number = 100

  create(schema: any, factories: EweyFactory[]) {
    if (schema?.type !== 'boolean'){
      return null
    }
    return CheckboxComponent
  }
}

export default CheckboxFactory
