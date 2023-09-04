import { JsonObjectType } from "../eweyField/JsonType"

export interface CrudParams {
  search_filter?: JsonObjectType
  search_order?: JsonObjectType
  page_key?: string
  limit?: number
}
