import { useSearchParams } from "react-router-dom";
import Update from "./Update";
import Read from "./Read";
import Create from "./Create";
import Search from "./Search";
import { PersistyOperationsProvider } from "../PersistyOperationsProvider";
import { EweyFactoryProvider, useEweyFactories } from "../../providers/EweyFactoryProvider";
import ResultFieldFactory from "../ewey/ResultFieldFactory";
import ResultSetFieldFactory from "../ewey/ResultSetFieldFactory";

export interface RouterProps {
  storeName: string
}

export default function Router({ storeName }: RouterProps) {
  const [queryParams] = useSearchParams();
  const key = queryParams.get("key")
  const edit = queryParams.get("edit")
  const factories = useEweyFactories()
  
  function renderComponent(){
    if (edit) {
      if (key) {
        return <Update />
      } else {
        return <Create />
      }
    }
    if (key) {
      return <Read />
    } else {
      return <Search />
    }
  }

  return (
    <EweyFactoryProvider factories={[
      ...factories,
      new ResultFieldFactory(),
      new ResultSetFieldFactory(),
    ]}>
      <PersistyOperationsProvider storeName={storeName}>
        {renderComponent()}
      </PersistyOperationsProvider>
    </EweyFactoryProvider>
  )
}