import StorageIcon from '@mui/icons-material/Storage';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Route } from "react-router-dom";
import OpenApiProvider from "../openApi/OpenApiProvider";
import OpenApiSummary, { SummaryOperation, summaryOperation } from "../openApi/OpenApiSummary";
import { OpenApi } from "../openApi/model/OpenApi";
import { BearerToken } from "../oauth/OAuthBearerTokenProvider";
import Router from './containers/Router';
import DataRouter from './containers/DataRouter';

const OPERATIONS = ['create', 'read', 'update', 'delete', 'search', 'count', "read_batch", "edit_batch"]
const DATA_OPERATIONS = ['file_read', 'file_count', 'file_delete', 'file_search', 'file_read_batch', 'upload_create', 'upload_delete', 'upload_finish', 'upload_read', 'upload_search', 'upload_part_count', 'upload_part_search', 'upload_part_create']


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
  const stores: any = {}
  const dataStores: any = {}
  for (const operation of openApi.operations) {
    const { operationId } = operation
    operationsById[operationId] = operation
  }

  const nonStoreOperations = { ...operationsById }

  for (const component of Object.values(openApi.components)) {
    const { persistyStored, persistyData } = component
    if (persistyStored) {
      const storeName = persistyStored.store_name
      if (storeName){ 
        stores[storeName] = persistyStored
        for (const op of OPERATIONS){
          delete nonStoreOperations[`${storeName}_${op}`]
        }
      }
    } else if (persistyData) {
      const storeName = persistyData.store_name
      if (storeName){ 
        dataStores[storeName] = persistyData
        for (const op of DATA_OPERATIONS){
          delete nonStoreOperations[`${storeName}_${op}`]
        }
      }
    }
  }

  const result = Object.keys(nonStoreOperations).map(key => {
    const operation = nonStoreOperations[key]
    const op = summaryOperation(operation, token)
    op.categoryKey = "operations"
    return op
  })

  for (const store of Object.keys(stores)) {
    result.push({
      key: store,
      icon: () => <StorageIcon />,
      disabled: false,
      component: () => ( <Router storeName={store} /> ),
      categoryKey: 'stores'
    })
  }
  for (const store of Object.keys(dataStores)) {
    result.push({
      key: store,
      icon: () => <UploadFileIcon />,
      disabled: false,
      component: () => ( <DataRouter storeName={store} /> ),
      categoryKey: 'data'
    })
  }

  return result
}
