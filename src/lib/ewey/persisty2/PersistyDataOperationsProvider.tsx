import { ReactElement, createContext, useContext } from "react";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { AnySchemaObject } from "../schemaCompiler";


export interface PersistyDataOperations {
  storeName: string
  baseUrl: string
  fileSchema: AnySchemaObject
  fileCountOp?: OpenApiOperation
  fileDeleteOp?: OpenApiOperation
  fileReadOp?: OpenApiOperation
  fileSearchOp?: OpenApiOperation
  uploadCreateOp?: OpenApiOperation
  uploadDeleteOp?: OpenApiOperation
  uploadFinishOp?: OpenApiOperation
  uploadPartCountOp?: OpenApiOperation
  uploadPartCreateOp?: OpenApiOperation
  uploadPartSearchOp?: OpenApiOperation
}

export const PersistyDataOperationsContext = createContext<PersistyDataOperations | null>(null);

interface PersistyDataOperationsProviderProps {
  storeName: string
  children: ReactElement | ReactElement[];
}

export function PersistyDataOperationsProvider({ storeName, children }: PersistyDataOperationsProviderProps) {
  const openApi = useOpenApi()
  const value = {
    storeName,
    baseUrl: openApi.baseUrl,
    fileSchema: openApi.components[toCamelCase(storeName)],
    fileCountOp: find('file_count'),
    fileDeleteOp: find('file_delete'),
    fileReadOp: find('file_read'),
    fileSearchOp: find('file_search'),
    uploadCreateOp: find('upload_create'),
    uploadDeleteOp: find('upload_delete'),
    uploadFinishOp: find('upload_finish'),
    uploadPartCountOp: find('upload_part_count'),
    uploadPartCreateOp: find('upload_part_create'),
    uploadPartSearchOp: find('upload_part_search'),
  }

  function find(suffix: string) {
    return openApi.operations.find(op => op.operationId === `${storeName}_${suffix}`)
  }

  return (
    <PersistyDataOperationsContext.Provider value={value}>
      {children}
    </PersistyDataOperationsContext.Provider>
  );
};

export default function usePersistyDataOperations(): PersistyDataOperations {
    const operations = useContext(PersistyDataOperationsContext);
    if (!operations){
      throw new Error('missing_persisty_data_operations_provider')
    }
    return operations;
}

function toCamelCase(name: string){
  let parts = name.split('_')
  parts = parts.map(p => p ? (p.substring(0, 1).toUpperCase() + p.substring(1)) : "")
  const result = parts.join("")
  return result
}
