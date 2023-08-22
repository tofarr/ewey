import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory";
import EweyField from "./EweyField";
import EweyFactory from "../eweyFactory/EweyFactory";

const RefWrapper = (
  componentName: string,
  components: any,
  currentPath: string[],
  factories: EweyFactory[],
) => {
  let JsonSchemaComponent: EweyField<any> | null = null;
  const RefComponent: EweyField<any> = ({ value, onSetValue }) => {
    const schema = components[componentName];
    if (!JsonSchemaComponent) {
      JsonSchemaComponent = JsonSchemaFieldFactory(
        schema,
        components,
        currentPath,
        factories,
      );
    }
    return <JsonSchemaComponent value={value} onSetValue={onSetValue} />;
  };
  return RefComponent;
};

export default RefWrapper;
