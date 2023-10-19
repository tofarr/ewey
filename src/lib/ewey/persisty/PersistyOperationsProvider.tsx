import { ReactElement, createContext, useContext } from "react";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";


export interface PersistyOperations {
  storeName: string
  createOp?: OpenApiOperation
  readOp?: OpenApiOperation
  updateOp?: OpenApiOperation
  deleteOp?: OpenApiOperation
  searchOp?: OpenApiOperation
  countOp?: OpenApiOperation
}

export const PersistyOperationsContext = createContext<PersistyOperations | null>(null);

interface PersistyOperationsProviderProps {
  storeName: string
  children: ReactElement | ReactElement[];
}

export function PersistyOperationsProvider({ storeName, children }: PersistyOperationsProviderProps) {
  const openApi = useOpenApi()
  const value = {
    storeName,
    createOp: find('create'),
    readOp: find('read'),
    updateOp: find('update'),
    deleteOp: find('delete'),
    searchOp: find('search'),
    countOp: find('count'),
  }

  function find(suffix: string) {
    return openApi.operations.find(op => op.operationId === `${storeName}_${suffix}`)
  }

  return (
    <PersistyOperationsContext.Provider value={value}>
      {children}
    </PersistyOperationsContext.Provider>
  );
};

export default function usePersistyOperations(): PersistyOperations {
    const operations = useContext(PersistyOperationsContext);
    if (!operations){
      throw new Error('missing_persisty_operations_provider')
    }
    return operations;
}
