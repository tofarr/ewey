import { useSearchParams } from "react-router-dom";
import { EweyFactoryProvider, useEweyFactories } from "../../providers/EweyFactoryProvider";
import Fader from "../../component/Fader";
import FaderSwitch from "../../component/FaderSwitch";
import { useState } from "react";
import LoadingComponent from "../../component/LoadingComponent";
import DataSearch from "./DataSearch";
import { PersistyDataOperationsProvider } from "../PersistyDataOperationsProvider";
import DataResultSetFieldFactory from "../ewey/DataResultSetFieldFactory";

export interface DataRouterProps {
  storeName: string
}

enum Mode {
  CREATE,
  READ,
  UPDATE,
  SEARCH,
}

export default function DataRouter({ storeName }: DataRouterProps) {
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
        <Fader show={mode === Mode.CREATE}><div>Create</div></Fader>
        <Fader show={mode === Mode.READ}><div>Read</div></Fader>
        <Fader show={mode === Mode.UPDATE}><div>Upate</div></Fader>
        <Fader show={mode === Mode.SEARCH}><DataSearch /></Fader>
      </FaderSwitch>
    )
  }

  return (
    <EweyFactoryProvider factories={[
      ...factories,
      new DataResultSetFieldFactory(),
    ]}>
      <PersistyDataOperationsProvider storeName={previousStoreName}>
        {renderComponent()}
      </PersistyDataOperationsProvider>
    </EweyFactoryProvider>
  )
}