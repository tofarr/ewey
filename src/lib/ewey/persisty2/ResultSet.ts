import Result from "./Result"

export default interface ResultSet {
  results: Result[]
  next_page_key?: string | null
}
