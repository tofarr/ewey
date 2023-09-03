export default interface EweyProps<T> {
  path?: string[];
  value?: T;
  onSetValue?: (value?: T) => void;
}
