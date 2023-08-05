import EweyComponent from '../eweyComponent/EweyComponent'

interface EweyFactory{
  priority: number
  create(schema: any, factories: EweyFactory[]): EweyComponent<any> | undefined | null
}

export default EweyFactory
