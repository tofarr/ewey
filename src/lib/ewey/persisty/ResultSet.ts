import { Result } from "./Result"

export interface ResultSet {
  results: Result[]
  next_page_key?: string | null
}
