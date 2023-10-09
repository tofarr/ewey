import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button"
import { useOAuthBearerToken } from "../../oauth/OAuthBearerTokenProvider"
import { useOpenApi } from "../../openApi/OpenApiProvider"
import OpenApiQuery from "../../openApi/OpenApiQuery";
import { Fragment, useState } from "react";
import EweyField from "../../eweyField/EweyField";
import Result from "../Result";
import SelectOneSearchDialog from "../components/SelectOneSearchDialog";
import { CircularProgress } from "@mui/material";


export default function HasUrlWrapper(
  validate: (itemKey: string | null) => boolean,
  fileStoreName: string,
  resizedImgUrl?: string | null,
) {
  const HasUrlField: EweyField<string|null> = ({ value, onSetValue }) => {
    return (
      <div>Copy the BelongsToField</div>
    )
  }
  return HasUrlField
}
