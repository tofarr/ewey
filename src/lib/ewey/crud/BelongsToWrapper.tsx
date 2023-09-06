import ErrorIcon from "@mui/icons-material/Error";
import LinkIcon from '@mui/icons-material/Link';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import EweyField from "../eweyField/EweyField";
import { JsonObjectType } from "../eweyField/JsonType";
import { headersFromToken } from "../openApi/headers";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { useOpenApi } from "../openApi/OpenApiProvider";

const BelongsToWrapper = (linkedStoreName: string, labelAttrNames: string[]) => {
  const BelongsToField: EweyField<boolean> = ({ value, onSetValue }) => {
    
    const openApi = useOpenApi();
    const operation = openApi.getOperation(`${linkedStoreName}_read`);
    const headers = headersFromToken(useOAuthBearerToken()?.token);
    const {
      isLoading,
      error,
      data: item,
    } = useQuery({
      queryKey: [operation.operationId, value, headers],
      queryFn: () => operation.invoke({key: value}, headers),
    });

    function renderLabel() {
      if (isLoading) {
        return <CircularProgress size={24} />
      }
      if (error) {
        return <ErrorIcon color="error" fontSize="large" />
      }
      const label = labelAttrNames.map(k => ((item as JsonObjectType)[k] || '')).join(" ")
      if (!label){
        return <LinkIcon />
      }
      return label
    }

    return (
      <Button
        disabled={!onSetValue} 
        variant="outlined"
      >
        {renderLabel()}
      </Button>
    );
  };
  return BelongsToField;
};

export default BelongsToWrapper;
