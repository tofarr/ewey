import { JsonObjectType } from "../eweyField/JsonType"

export interface Result {
  key: string
  deletable: boolean
  updatable: boolean
  item: JsonObjectType
}
