import StorageIcon from '@mui/icons-material/Storage';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Route } from "react-router-dom";
import OpenApiProvider from "../openApi/OpenApiProvider";
import OpenApiSummary, { SummaryOperation, summaryOperation } from "../openApi/OpenApiSummary";
import { OpenApi } from "../openApi/model/OpenApi";
import { BearerToken } from "../oauth/OAuthBearerTokenProvider";
import PersistySearch from './PersistySearch';
// import PersistyDataSearch from './PersistyDataSearch';

const OPERATIONS = ['create', 'read', 'update', 'delete', 'search', 'count', "read_batch", "edit_batch", "get_download_url", "get_upload_form"]

export const persistySummaryRoute = (prefix: string, url: string) => {
  return (
    <Route
      path={`${prefix}/:op?`}
      element={
        <OpenApiProvider url={url}>
          <OpenApiSummary operationFactory={persistySummaryFactory} />
        </OpenApiProvider>
      }
    />
  );
};

export function persistySummaryFactory(openApi: OpenApi, token?: BearerToken): SummaryOperation[] {
  const operationsById: any = {}
  const stores: string[] = []
  const dataStores: string[] = []
  for (const operation of openApi.operations) {
    const { operationId } = operation
    operationsById[operationId] = operation
  }
  for (const operation of openApi.operations) {
    const { operationId } = operation
    if (operationId.endsWith("_search")) {
      const store = operationId.substring(0, operationId.length - 7)
      if (operationsById[`${store}_get_download_url`] || operationsById[`${store}_get_upload_form`]){
        dataStores.push(store)
      }else{
        stores.push(store)
      }
    }
  }
  const nonStoreOperations = { ...operationsById }
  for (const store of [...stores, ...dataStores]) {
    for (const op of OPERATIONS) {
      const key = `${store}_${op}`
      delete nonStoreOperations[key]
    }
  }
  
  const result = Object.keys(nonStoreOperations).map(key => {
    const operation = nonStoreOperations[key]
    const op = summaryOperation(operation, token)
    op.categoryKey = "operations"
    return op
  })

  for (const store of stores) {
    result.push({
      key: store,
      icon: () => <StorageIcon />,
      disabled: false,
      component: () => ( <PersistySearch store={store} /> ),
      categoryKey: 'stores'
    })
  }
  /*
  for (const store of dataStores) {
    result.push({
      key: store,
      icon: () => <UploadFileIcon />,
      disabled: false,
      component: () => ( <PersistyDataSearch store={store} /> ),
      categoryKey: 'data'
    })
  }
  */

  return result
}
