import EweyField from "../eweyField/EweyField"
import { OpenApiOperation } from "../openApi/model/OpenApiOperation"
import Grid from '@mui/material/Grid';
import { PersistyDeleteButton } from './PersistyDeleteButton';
import { PersistyInfoButton } from "./PersistyInfoButton";
import { Result } from "./Result";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { useState } from "react";

export const PersistyActionsWrapper = (
  storeName: string
) => {
  const PersistyActionsField: EweyField<Result> = ({ value }) => {
    const openApi = useOpenApi()
    const readOperation = openApi.operations.find(op => op.operationId === `${storeName}_read`)
    const deleteOperation = openApi.operations.find(op => op.operationId === `${storeName}_delete`)

    return (
      <Grid container direction="row" spacing={1} justifyContent="flex-end">
        {readOperation && 
          <Grid item>
            <PersistyInfoButton result={value} readOperation={readOperation} />
          </Grid>
        }
        {deleteOperation &&
          <Grid item>
            <PersistyDeleteButton
              result={value}
              searchOperationName={`${storeName}_search`} 
              deleteOperation={deleteOperation}
            />
          </Grid>
        }
      </Grid>
    )
  }
  return PersistyActionsField
}
