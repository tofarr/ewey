import { useState } from "react"
import JsonType from "../eweyField/JsonType"
import OpenApiForm from "../openApi/OpenApiForm"
import { useOpenApi } from "../openApi/OpenApiProvider"
import OpenApiQuery from "../openApi/OpenApiQuery"
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider"
import OpenApiQueryContent from "../openApi/OpenApiQueryContent"


export interface PersistyItemProps {
  store: string
  itemKey: string
}

const PersistyItem = ({ store, itemKey }: PersistyItemProps) => {
  const openApi = useOpenApi()
  const updateOperation = openApi.operations.find(op => op.operationId === `${store}_read`)  
  const token = useOAuthBearerToken()
  const updatable = updateOperation && (!updateOperation.requiresAuth || token?.token);

  if (!updatable) {
    return (
      <OpenApiQueryContent operationId={`${store}_read`} params={{ key: itemKey}} />
    )
  }

  return (
    <OpenApiQuery operationId={`${store}_read`} params={{ key: itemKey}}>
      {(item) => (
        <OpenApiForm operationId={`${store}_update`} value={{item}} />
      )}
    </OpenApiQuery>
  )
}

export default PersistyItem
