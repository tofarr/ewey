import { JsonObjectType } from "../../eweyField/JsonType";
import EweyField from "../../eweyField/EweyField";
import Result from "./Result";
// import usePersistyOperations from "../usePersistyOperations";

const ResultFieldWrapper = (storeName: string, resultField: EweyField<JsonObjectType>) => {
  const ResultField: EweyField<Result> = ({ value, onSetValue }) => {
    // const persistyOperations = usePersistyOperations(storeName)
    return resultField({
      value: value.item,
      onSetValue: onSetValue ? ((item: JsonObjectType) => onSetValue({...value, item})) : undefined
    })
  };
  return ResultField;
};

export default ResultFieldWrapper;
