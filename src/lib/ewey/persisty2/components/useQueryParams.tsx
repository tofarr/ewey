import { useSearchParams } from "react-router-dom";
import { JsonObjType, jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley";
import { useEffect, useState } from "react";
import isEqual from 'lodash/isEqual';
import { JsonObjectType } from "../../eweyField/JsonType";

export default function useQueryParams<T>(filterParams: (params: T) => T): [T, (newParams: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<T>(filterParams(queryParamsToJsonObj(searchParams) as T) as T)
  useEffect(() => {
    setQueryParams((prevQueryParams: T) => {
      const newQueryParams = filterParams(queryParamsToJsonObj(searchParams) as T)
      return isEqual(queryParams, newQueryParams) ? prevQueryParams : queryParams
    })
  }, [searchParams])

  function handleSetParams(newParams: T) {
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjectType)
    setSearchParams(newQueryParams as any)
    setQueryParams(newParams)
  }
  return [queryParams, handleSetParams]
}
