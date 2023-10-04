import EweyField from "../eweyField/EweyField";
import { Result } from "./Result";
import { JsonObjectType } from "../eweyField/JsonType";

const ResultWrapper = (resultField: EweyField<JsonObjectType>) => {
  const ResultField: EweyField<Result> = ({ value, onSetValue }) => {
    return resultField({
      value: value.item,
      onSetValue: onSetValue ? ((item) => onSetValue({...value, item})) : undefined
    })
  };
  return ResultField;
};

export default ResultWrapper;
