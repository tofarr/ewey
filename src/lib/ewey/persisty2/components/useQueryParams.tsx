/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams } from "react-router-dom";
import { jsonObjToQueryParams, queryParamsToJsonObj } from "json-urley";
import { useEffect, useState } from "react";
import isEqual from 'lodash/isEqual';
import { JsonObjType } from "json-urley";

export default function useQueryParams<T>(filterParams: (params: T) => T): [T, (newParams: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState<T>(filterParams(queryParamsToJsonObj(searchParams) as T) as T)
  useEffect(() => {
    setQueryParams((prevQueryParams: T) => {
      const newQueryParams = filterParams(queryParamsToJsonObj(searchParams) as T)
      return isEqual(queryParams, newQueryParams) ? prevQueryParams : queryParams
    })
  }, [filterParams, searchParams])

  function handleSetParams(newParams: T) {
    const newQueryParams = jsonObjToQueryParams(newParams as JsonObjType)
    setSearchParams(newQueryParams as any)
    setQueryParams(newParams)
  }
  return [queryParams, handleSetParams]
}
