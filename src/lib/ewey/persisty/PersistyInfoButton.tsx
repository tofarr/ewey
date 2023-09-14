import { Fragment } from "react";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton"
import { Link } from "react-router-dom";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";


export interface PersistyInfoButtonProps {
  itemKey: string
  readOperation: OpenApiOperation
}

export function PersistyInfoButton({ itemKey, readOperation}: PersistyInfoButtonProps) {
  const token = useOAuthBearerToken()
  const isLocked = readOperation.requiresAuth && !token?.token;
  
  return (
    <Fragment>
      <Link to={`?key=${itemKey}`}>
        <IconButton disabled={isLocked}>
          <EditIcon />
        </IconButton>
      </Link>
    </Fragment>
  )
}
