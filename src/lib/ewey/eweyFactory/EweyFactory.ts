import EweyComponent from '../eweyComponent/EweyComponent'
import JsonSchema from './JsonSchema'

interface EweyFactory{
  priority: number
  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]): EweyComponent<any> | undefined | null
}

export default EweyFactory
