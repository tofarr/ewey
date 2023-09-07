import StorageIcon from '@mui/icons-material/Storage';
import { Route } from "react-router-dom";
import OpenApiProvider from "../openApi/OpenApiProvider";
import OpenApiSummary, { SummaryOperation, summaryOperation } from "../openApi/OpenApiSummary";
import { OpenApi } from "../openApi/model/OpenApi";
import { BearerToken } from "../oauth/OAuthBearerTokenProvider";
import PersistySearch from './PersistySearch';

const OPERATIONS = ['create', 'read', 'update', 'delete', 'search', 'count', "read_batch", "edit_batch"]

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
  for (const operation of openApi.operations) {
    const { operationId } = operation
    operationsById[operationId] = operation
    if (operationId.endsWith("_search")) {
      const store = operationId.substring(0, operationId.length - 7)
      stores.push(store)
    }
  }
  const nonStoreOperations = { ...operationsById }
  for (const store of stores) {
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

  return result
}
