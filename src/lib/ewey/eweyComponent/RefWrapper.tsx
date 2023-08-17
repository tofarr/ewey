import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';
import EweyComponent from './EweyComponent';
import EweyFactory from '../eweyFactory/EweyFactory';

const RefWrapper = (componentName: string, components: any, currentPath: string[], factories: EweyFactory[]) => {
  const RefComponent: EweyComponent<any> = ({value, onSetValue}) => {
    if (!value) {
      return null
    }
    const schema = components[componentName]
    const JsonSchemaComponent = JsonSchemaComponentFactory(schema, components, currentPath, factories)
    return (
      <JsonSchemaComponent value={value} onSetValue={onSetValue} />
    )
  }
  return RefComponent
}

export default RefWrapper
