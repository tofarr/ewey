import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { getLabel } from "../../../label";
import { SearchParams } from "../../containers/Search";
import usePersistyOperations from "../../PersistyOperationsProvider";
import OpenApiQuery from "../../../openApi/OpenApiQuery";
import ErrorComponent from "../../../component/ErrorComponent";
import { JsonObjectType } from "../../../eweyField/JsonType";
import { useEffect, useState } from "react";

export interface CountProps {
  params: SearchParams
}

export default function Count({ params }: CountProps) {
  console.log('Render Count')
  const { countOp } = usePersistyOperations()
  const { t } = useTranslation()
  const countParams: JsonObjectType = {}
  if (params.search_filter) {
    countParams.search_filter = params.search_filter
  }

  function renderLabel(count: number) {
    if (!count) {
      return getLabel('no_results', t)
    }
    const result = t('x_results', `${count} Results`, {x: count});
    return result

  }

  if (!countOp){
    return <ErrorComponent />
  }

  return (
    <OpenApiQuery 
      operationId={countOp.operationId} 
      params={countParams}
      ResultsLoadingComponent={() => (
        <CircularProgress size={24} />
      )}
      refetchOnMount={false}
    >
      {value => (
         <Typography variant="body2">{renderLabel(value as number)}</Typography>
      )}
    </OpenApiQuery>
  )
}
