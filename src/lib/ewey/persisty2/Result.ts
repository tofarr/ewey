import { JsonObjectType } from "../eweyField/JsonType"

interface Result {
  key: string
  deletable: boolean
  updatable: boolean
  item: JsonObjectType
}

export default Result
