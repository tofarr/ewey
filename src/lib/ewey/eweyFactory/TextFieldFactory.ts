import { Validator } from '@cfworker/json-schema';

import TextFieldWrapper from '../eweyComponent/TextFieldWrapper';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class TextFieldFactory implements EweyFactory {
  priority: number = 100

  create(schema: JsonSchema, components: any, factories: EweyFactory[]) {
    if (!schema || schema.type !== 'string') {
      return null
    }
    const validator = new Validator(schema)
    const maxLength = schema.maxLength
    const multiline = !(schema.format) && ((!maxLength) || (maxLength > 255))
    const textFieldComponent = TextFieldWrapper(validator, multiline)
    return textFieldComponent
  }
}

export default TextFieldFactory
