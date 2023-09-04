import Typography from "@mui/material/Typography";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { getLabel, keyToLabel } from "../label";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { CrudParams } from "./CrudParams";
import { useQuery } from "@tanstack/react-query";
import { headersFromToken } from "../openApi/OpenApiForm";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import JsonType from "../eweyField/JsonType";

export interface CrudCountProps {
  operation: OpenApiOperation
  params: CrudParams
}

const CrudCount = ({ operation, params }: CrudCountProps) => {
  const { t } = useTranslation();
  const headers = headersFromToken(useOAuthBearerToken()?.token);
  const {
    isLoading,
    error,
    data: count,
  } = useQuery({
    queryKey: [operation.operationId],
    queryFn: () => operation.invoke(params as JsonType, headers),
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
