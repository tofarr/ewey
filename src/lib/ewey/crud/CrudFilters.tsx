
import { Fragment, useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTranslation } from 'react-i18next';
import { CrudParams } from "./CrudParams";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EweyForm from '../EweyForm';
import { useOpenApi } from '../openApi/OpenApiProvider';
import { resolveRef } from '../ComponentSchemas';
import JsonType, { JsonObjectType } from '../eweyField/JsonType';
import { getLabel } from '../label';
import { AnySchemaObject } from '../schemaCompiler';
import { EweyLayoutHint, EweyLayoutHintProvider } from '../providers/EweyLayoutHint';
import DialogHeader from '../component/DialogHeader';

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
      <IconButton onClick={() => setOpen(true)}>
        <FilterAltIcon />
      </IconButton>
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader label="search_filters" setDialogOpen={setOpen} />
          <EweyLayoutHintProvider hint={EweyLayoutHint.LABELS_ALWAYS_ABOVE}>
            <EweyForm 
              schema={schema}
              value={internalParams as JsonObjectType} 
              onSetValue={(value) => setInternalParams(value as CrudParams)}
              onSubmit={handleSubmit}
            />
          </EweyLayoutHintProvider>  
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default CrudFilters;
