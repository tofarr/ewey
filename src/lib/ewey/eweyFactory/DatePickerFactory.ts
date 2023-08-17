import { Validator } from '@cfworker/json-schema';

import DatePickerWrapper from '../eweyComponent/DatePickerWrapper';
import EweyFactory from './EweyFactory';
import JsonSchema from './JsonSchema'

const FORMATS = ['date-time', 'date']

class DatePickerFactory implements EweyFactory {
  priority: number = 110

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (!schema || schema.type !== 'string' || !FORMATS.includes(schema.format)) {
      return null
    }
    const validator = new Validator(schema)
    const datePickerComponent = DatePickerWrapper(validator, schema.format)
    return datePickerComponent
  }
}

export default DatePickerFactory
