import { JsonObjType } from "json-urley";

interface Result {
  key: string
  deletable: boolean
  updatable: boolean
  item: JsonObjType
}

export default Result
