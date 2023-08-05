import EweyProps from './EweyProps'

interface EweyComponent<T>{
  (props: EweyProps<T>): JSX.Element | null
}

export default EweyComponent
