import ReadOnlyWrapper from "../eweyField/ReadOnlyWrapper";
import EweyField from "../eweyField/EweyField";
import EweyFactory from "./EweyFactory";
import JsonSchema from "./JsonSchema";

class ReadOnlyFactory implements EweyFactory {
  factory: EweyFactory;
  priority: number = 150;

  constructor(factory: EweyFactory, priority: number = 150) {
    this.factory = factory;
    this.priority = priority;
  }

  create(
    schema: JsonSchema,
    components: any,
    currentPath: string[],
    factories: EweyFactory[],
  ) {
    const component = this.factory.create(
      schema,
      components,
      currentPath,
      factories,
    );
    return ReadOnlyWrapper(component as EweyField<any>);
  }
}

export default ReadOnlyFactory;
