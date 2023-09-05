
import { Fragment, useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTranslation } from 'react-i18next';
import { CrudParams } from "./CrudParams";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import EweyForm from '../EweyForm';
import { useOpenApi } from '../openApi/OpenApiProvider';
import { resolveRef } from '../ComponentSchemas';
import JsonType, { JsonObjectType } from '../eweyField/JsonType';
import { getLabel } from '../label';
import { AnySchemaObject } from '../schemaCompiler';

export interface CrudFilterProps {
  store: string
  params: CrudParams
  onSetParams: (params: CrudParams) => void
}

const CrudFilters = ({ store, params, onSetParams }: CrudFilterProps) => {
  const openApi = useOpenApi()
  const [open, setOpen] = useState(false)
  const [internalParams, setInternalParams] = useState(params)
  const { t } = useTranslation()
  const operation = openApi.getOperation(`${store}_search`)
  const [schema, setSchema] = useState<AnySchemaObject | null>(null)
  
  useEffect(() => {
    let paramSchema = resolveRef(operation.paramsSchema, operation.paramsSchema.components)
    const { properties } = paramSchema
    paramSchema = {
      ...paramSchema,
      properties: {
        search_filter: properties.search_filter,
        search_order: properties.search_order
      }
    }
    setSchema(paramSchema)
  }, [operation])

  function handleSubmit(params: JsonType) {
    onSetParams(params as CrudParams)
    setOpen(false)
  }

  if (!schema) {
    return null
  }
 
  return (
    <Fragment>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        <FilterAltIcon />
      </Button>
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography variant="h4">{getLabel('search_filters', t)}</Typography>    
          <EweyForm 
            schema={schema}
            value={internalParams as JsonObjectType} 
            onSetValue={(value) => setInternalParams(value as CrudParams)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default CrudFilters;
