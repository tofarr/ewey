import EweyProps from "./EweyProps";

interface EweyField<T> {
  (props: EweyProps<T>): JSX.Element | null;
}

export default EweyField;
