import EweyComponent from './EweyComponent';

const ReadOnlyWrapper = (Component: EweyComponent<any>) => {
  const ReadOnlyComponent: EweyComponent<any> = ({value}) => {
    return (
      <Component value={value} />
    )
  }
  return ReadOnlyComponent
}

export default ReadOnlyWrapper
