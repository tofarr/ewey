import { useSearchParams } from "react-router-dom";
import Update from "./Update";
import Read from "./Read";


export default function Item() {
  const [queryParams] = useSearchParams();
  const update = queryParams.get("update")
  if (update) {
    return <Update />
  }
  return <Read />
}