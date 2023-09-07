import EweyFactory from "../eweyFactory/EweyFactory";
import CheckboxFactory from "./CheckboxFactory";
import DatePickerFactory from "./DatePickerFactory";
import SelectFieldFactory from "./SelectFieldFactory";
import FieldSetFactory from "./FieldSetFactory";
import ListFactory from "./ListFactory";
import NullableFieldFactory from "./NullableFieldFactory";
import NumberFieldFactory from "./NumberFieldFactory";
import RefFactory from "./RefFactory";
import TableFactory from "./TableFactory";
import TextFieldFactory from "./TextFieldFactory";
import BelongsToFactory from "../persisty/BelongsToFactory";

export const FACTORIES: EweyFactory[] = [
  new TableFactory(),
  new CheckboxFactory(),
  new DatePickerFactory(),
  new FieldSetFactory(),
  new ListFactory(),
  new NullableFieldFactory(),
  new NumberFieldFactory(),
  new RefFactory(),
  new SelectFieldFactory(),
  new TextFieldFactory(),
  new BelongsToFactory(),
];
