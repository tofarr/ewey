import { Fragment } from "react";
import { useSearchParams } from "react-router-dom";
import Update from "./Update";
import Read from "./Read";
import Create from "./Create";
import Search from "./Search";
import { PersistyOperationsProvider } from "../PersistyOperationsProvider";
import { EweyFactoryProvider, useEweyFactories } from "../../providers/EweyFactoryProvider";
import ResultFieldFactory from "../ewey/ResultFieldFactory";
import ResultSetFieldFactory from "../ewey/ResultSetFieldFactory";
import BelongsToFactory from "../ewey/BelongsToFactory";
import Transitioner from "../components/Transitioner";

export interface RouterProps {
  storeName: string
}

enum Mode {
  CREATE,
  READ,
  UPDATE,
  SEARCH,
}

export default function Router({ storeName }: RouterProps) {
  const [queryParams] = useSearchParams();
  const key = queryParams.get("key")
  const edit = queryParams.get("edit")
  const factories = useEweyFactories()
  
  function getMode(){
    if (edit) {
      return key ? Mode.UPDATE : Mode.CREATE
    }
    return key ? Mode.READ : Mode.SEARCH
  }

  function renderComponent(){
    const mode = getMode()
    return (
      <Fragment>
        <Transitioner show={mode === Mode.CREATE}><Create /></Transitioner>
        <Transitioner show={mode === Mode.READ}><Read /></Transitioner>
        <Transitioner show={mode === Mode.UPDATE}><Update /></Transitioner>
        <Transitioner show={mode === Mode.SEARCH}><Search /></Transitioner>
      </Fragment>
    )
  }

  return (
    <EweyFactoryProvider factories={[
      ...factories,
      new ResultFieldFactory(),
      new ResultSetFieldFactory(),
      new BelongsToFactory(),
    ]}>
      <PersistyOperationsProvider storeName={storeName}>
        {renderComponent()}
      </PersistyOperationsProvider>
    </EweyFactoryProvider>
  )
}