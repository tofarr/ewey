import EweyField from './EweyField';

const ReadOnlyWrapper = (Component: EweyField<any>) => {
  const ReadOnlyComponent: EweyField<any> = ({value}) => {
    return (
      <Component value={value} />
    )
  }
  return ReadOnlyComponent
}

export default ReadOnlyWrapper
