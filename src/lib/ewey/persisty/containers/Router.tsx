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
import Fader from "../../component/Fader";
import FaderSwitch from "../../component/FaderSwitch";
import { useState } from "react";
import LoadingComponent from "../../component/LoadingComponent";
import HasUrlFactory from "../ewey/HasUrlFactory";

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
  const [previousStoreName, setPreviousStoreName] = useState(storeName);
  
  function getMode(){
    if (edit) {
      return key ? Mode.UPDATE : Mode.CREATE
    }
    return key ? Mode.READ : Mode.SEARCH
  }

  function renderComponent(){
    if (previousStoreName !== storeName) {
      // In the event that the url changed force components to remount
      setPreviousStoreName(storeName)
      return <LoadingComponent />
    }
    const mode = getMode()
    return (
      <FaderSwitch>
        <Fader show={mode === Mode.CREATE}><Create /></Fader>
        <Fader show={mode === Mode.READ}><Read /></Fader>
        <Fader show={mode === Mode.UPDATE}><Update /></Fader>
        <Fader show={mode === Mode.SEARCH}><Search /></Fader>
      </FaderSwitch>
    )
  }

  return (
    <EweyFactoryProvider factories={[
      ...factories,
      new ResultFieldFactory(),
      new ResultSetFieldFactory(),
      new BelongsToFactory(),
      new HasUrlFactory(),
    ]}>
      <PersistyOperationsProvider storeName={previousStoreName}>
        {renderComponent()}
      </PersistyOperationsProvider>
    </EweyFactoryProvider>
  )
}