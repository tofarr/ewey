import StorageIcon from '@mui/icons-material/Storage';
import { Route } from "react-router-dom";
import OpenApiProvider from "../openApi/OpenApiProvider";
import OpenApiSummary, { SummaryOperation, summaryOperation } from "../openApi/OpenApiSummary";
import { OpenApi } from "../openApi/model/OpenApi";
import { BearerToken } from "../oauth/OAuthBearerTokenProvider";
import EweyFactory from "../eweyFactory/EweyFactory";
import CrudSearch from './CrudSearch';

const OPERATIONS = ['create', 'read', 'update', 'delete', 'search', 'count', "read_batch", "edit_batch"]

export const crudSummaryRoute = (prefix: string, url: string) => {
  return (
    <Route
      path={`${prefix}/:op?`}
      element={
        <OpenApiProvider url={url}>
          <OpenApiSummary operationFactory={crudSummaryFactory} />
        </OpenApiProvider>
      }
    />
  );
};

export function crudSummaryFactory(openApi: OpenApi, token?: BearerToken, factories?: EweyFactory[]): SummaryOperation[] {
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
    const op = summaryOperation(operation, token, factories)
    op.categoryKey = "operations"
    return op
  })

  for (const store of stores) {
    result.push({
      key: store,
      icon: () => <StorageIcon />,
      disabled: false,
      component: () => (<CrudSearch store={store} />),
      categoryKey: 'stores'
    })
  }

  return result
}
