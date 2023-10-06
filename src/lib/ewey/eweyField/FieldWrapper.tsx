import { JsonType } from "json-urley";
import EweyProps from "./EweyProps";
import EweyField from "./EweyField";

export default function FieldWrapper<T>(key: string, ValueComponent: EweyField<JsonType>) {

  return ({ value, onSetValue}: EweyProps<T>) => {
      
    function handleSetItemValue(v: JsonType){
      if (onSetValue){
        onSetValue({ ...value, [key]: v})
      }
    }

    return (
      <ValueComponent
        value={(value as any)[key] as JsonType} 
        onSetValue={onSetValue ? handleSetItemValue : undefined} 
      />
    );
  };
}