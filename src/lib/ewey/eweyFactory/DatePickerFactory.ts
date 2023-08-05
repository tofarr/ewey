import { Validator } from '@cfworker/json-schema';

import DatePickerWrapper from '../eweyComponent/DatePickerWrapper';
import EweyFactory from './EweyFactory';

const FORMATS = ['date-time', 'date']

class DatePickerFactory implements EweyFactory {
  priority: number = 110

  create(schema: any, factories: EweyFactory[]) {
    if (!schema || schema.type !== 'string' || !FORMATS.includes(schema.format)) {
      return null
    }
    const validator = new Validator(schema)
    const datePickerComponent = DatePickerWrapper(validator, schema.format)
    return datePickerComponent
  }
}

export default DatePickerFactory
