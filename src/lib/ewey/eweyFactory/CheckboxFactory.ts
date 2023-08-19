import CheckboxWrapper from "../eweyField/CheckboxWrapper";
import EweyFactory from "./EweyFactory";
import JsonSchema from "./JsonSchema";

class CheckboxFactory implements EweyFactory {
  priority: number = 100;

  create(
    schema: JsonSchema,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    if (schema?.type !== "boolean") {
      return null;
    }
    return CheckboxWrapper(schema);
  }
}

export default CheckboxFactory;
