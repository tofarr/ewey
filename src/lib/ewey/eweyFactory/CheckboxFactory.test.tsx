import { render, screen } from "@testing-library/react";
import CheckboxFactory from "./CheckboxFactory";
import EweyField from "../eweyField/EweyField";
import CheckboxWrapper from "../eweyField/CheckboxWrapper";
import { schemaCompiler, ValidateFunction } from "../schemaCompiler";

test("renders Checkbox Field", () => {
  const checkboxFactory = new CheckboxFactory();
  const MyCheckbox = checkboxFactory.create(
    { type: "boolean" },
    {},
    [],
    [],
    [],
  ) as EweyField<boolean>;
  render(<MyCheckbox value={true} />);
  const checkboxElement = screen.getByRole("checkbox", { checked: true });
  expect(checkboxElement).toBeInTheDocument();
});
