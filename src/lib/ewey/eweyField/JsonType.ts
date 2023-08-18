
type JsonType =
  | boolean
  | number
  | string
  | JsonType[]
  | { [key: string]: JsonType };

export default JsonType

export interface JsonObjectType {
  [key: string]: JsonType
}
