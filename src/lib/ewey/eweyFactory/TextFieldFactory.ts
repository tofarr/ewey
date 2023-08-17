import { Validator } from '@cfworker/json-schema';

import TextFieldWrapper from '../eweyField/TextFieldWrapper';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

class TextFieldFactory implements EweyFactory {
  priority: number = 100

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (!schema || schema.type !== 'string') {
      return null
    }
    const isPassword = currentPath.length && currentPath[currentPath.length - 1].toLowerCase().indexOf("password") >= 0
    const type = isPassword ? "password" : "text"
    const validator = new Validator(schema)
    const maxLength = schema.maxLength
    const multiline = (!schema.format) && (!isPassword) && ((!maxLength) || (maxLength > 255))
    const textFieldComponent = TextFieldWrapper(validator, multiline, type)
    return textFieldComponent
  }
}

export default TextFieldFactory
