import { Validator } from '@cfworker/json-schema';

import NumberFieldWrapper from '../eweyComponent/NumberFieldWrapper';
import EweyFactory from './EweyFactory';

const NUMBER_TYPES = ['integer', 'number']

class NumberFieldFactory implements EweyFactory {
  priority: number = 110

  create(schema: any, factories: EweyFactory[]) {
    if (!NUMBER_TYPES.includes(schema.type)){
      return null
    }
    const validator = new Validator(schema)
    const textFieldComponent = NumberFieldWrapper(validator)
    return textFieldComponent
  }
}

export default NumberFieldFactory
