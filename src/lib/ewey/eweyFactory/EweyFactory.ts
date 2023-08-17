import EweyField from '../eweyField/EweyField'
import JsonSchema from './JsonSchema'

interface EweyFactory{
  priority: number
  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]): EweyField<any> | undefined | null
}

export default EweyFactory
