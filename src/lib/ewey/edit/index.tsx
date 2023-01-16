import EweyProps from '../EweyProps'
import ArrayComponent from './ArrayComponent'
import BooleanComponent from './BooleanComponent'
import DateTimeComponent from './DateTimeComponent'
import NumberComponent from './NumberComponent'
import ObjectComponent from './ObjectComponent'
import StringComponent from './StringComponent'


const COMPONENT_TYPES = [
  NumberComponent,
  BooleanComponent,
  DateTimeComponent,
  StringComponent,
  ObjectComponent,
  ArrayComponent
]


const EditComponent = (props: EweyProps) => {
  for (var component of COMPONENT_TYPES) {
    const result = component(props)
    if (result) {
      return result
    }
  }
  throw new Error('unprocessable_schema')
}

export default EditComponent
