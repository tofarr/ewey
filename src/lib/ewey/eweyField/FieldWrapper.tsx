import { JsonType } from "json-urley";
import EweyProps from "./EweyProps";
import { JsonObjectType } from "./JsonType";
import EweyField from "./EweyField";

export default function FieldWrapper<JsonObjectType>(key: string, ValueComponent: EweyField<JsonType>) {

  return ({ value, onSetValue}: EweyProps<JsonObjectType>) => {
      
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