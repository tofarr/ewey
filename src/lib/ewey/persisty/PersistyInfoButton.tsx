import { Fragment } from "react";
import MoreIcon from '@mui/icons-material/More';
import IconButton from "@mui/material/IconButton"
import { Link } from "react-router-dom";
import { OpenApiOperation } from "../openApi/model/OpenApiOperation";
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider";
import { Result } from "./Result";


export interface PersistyInfoButtonProps {
  result: Result
  readOperation: OpenApiOperation
}

export function PersistyInfoButton({ result, readOperation}: PersistyInfoButtonProps) {
  const token = useOAuthBearerToken()
  const isLocked = result.updatable && readOperation.requiresAuth && !token?.token;
  
  return (
    <Fragment>
      <Link to={`?key=${result.key}`}>
        <IconButton disabled={isLocked}>
          <MoreIcon />
        </IconButton>
      </Link>
    </Fragment>
  )
}
