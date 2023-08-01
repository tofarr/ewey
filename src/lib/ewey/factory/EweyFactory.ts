import { ReactNode } from 'react'
import EweyComponent from '../component/EweyComponent'

interface EweyFactory{
  priority: number
  create(schema: any, factories: EweyFactory[]): EweyComponent<any> | undefined | null
}

export default EweyFactory
