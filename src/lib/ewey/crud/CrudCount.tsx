import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { getLabel } from "../label";
import { CrudParams } from "./CrudParams";
import { useQuery } from "@tanstack/react-query";
import { headersFromToken } from "../openApi/OpenApiForm";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { JsonObjectType } from "../eweyField/JsonType";
import { useOpenApi } from "../openApi/OpenApiProvider";

export interface CrudCountProps {
  store: string
  params: CrudParams
}

const CrudCount = ({ store, params }: CrudCountProps) => {
  const { t } = useTranslation();
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const openApi = useOpenApi();
  const operation = openApi.getOperation(`${store}_count`)
  const {
    isLoading,
    error,
    data: count,
  } = useQuery({
    queryKey: [operation.operationId, params],
    queryFn: () => {
      const countParams: JsonObjectType = {}
      if (params.search_filter) {
        countParams.search_filter = params.search_filter
      }
      return operation.invoke(countParams, headers)
    },
  });

  function renderLabel() {
    if (!count) {
      return getLabel('no_results', t)
    }
    const result = t('x_results', `${count} Results`, {x: count});
    return result

  }

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  if (error) {
    return <ErrorIcon color="error" />
  }

  return (
    <Typography variant="body2">{renderLabel()}</Typography>
  )
}

export default CrudCount;
