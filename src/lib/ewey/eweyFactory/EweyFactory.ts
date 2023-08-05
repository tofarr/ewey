import EweyComponent from '../eweyComponent/EweyComponent'
import JsonSchema from './JsonSchema'

interface EweyFactory{
  priority: number
  create(schema: JsonSchema, components: any, factories: EweyFactory[]): EweyComponent<any> | undefined | null
}

export default EweyFactory
