import { JsonObjectType } from "../eweyField/JsonType"

export interface ResultSet {
  results: JsonObjectType[]
  next_page_key?: string | null
}
