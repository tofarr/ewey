type JsonType =
  | boolean
  | number
  | string
  | JsonType[]
  | { [key: string]: JsonType }
  | null;

export default JsonType;

export interface JsonObjectType {
  [key: string]: JsonType;
}
