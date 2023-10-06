
import { Fragment, useEffect, useState } from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { JsonObjType, JsonType } from "json-urley";
import { SearchParams } from '../../containers/Search';
import usePersistyOperations from '../../PersistyOperationsProvider';
import { AnySchemaObject } from 'ajv';
import { resolveRef } from '../../../ComponentSchemas';
import DialogHeader from '../../../component/DialogHeader';
import { EweyLayoutHint, EweyLayoutHintProvider } from '../../../providers/EweyLayoutHint';
import EweyForm from '../../../EweyForm';
import HeightAnimator from '../../../component/HeightAnimator';
import isEqual from 'lodash/isEqual';

export interface FilterProps {
  params: SearchParams
  onSetParams: (params: SearchParams) => void
}

export default function Filter({ params, onSetParams }: FilterProps) {
  const { searchOp } = usePersistyOperations()
  const [open, setOpen] = useState(false)
  const [internalParams, setInternalParams] = useState(params)
  const [schema, setSchema] = useState<AnySchemaObject | null>(null)
  
  useEffect(() => {
    if (!searchOp){
      return
    }
    let paramSchema = resolveRef(searchOp.paramsSchema, searchOp.paramsSchema.components)
    const { properties } = paramSchema
    paramSchema = {
      ...paramSchema,
      properties: {
        search_filter: properties.search_filter,
        search_order: properties.search_order
      }
    }
    setSchema(paramSchema)
  }, [searchOp])

  function handleSubmit(params: JsonType) {
    const newParams = { ...params as SearchParams }
    delete newParams.page_key
    onSetParams(newParams)
    setOpen(false)
  }

  function handleOpen(){
    if (!internalParams.search_filter){
      if (schema?.properties?.search_filter?.properties?.query){
        setInternalParams({search_filter:{query:""}})
      }
    }
    setOpen(true)
  }

  if (!schema) {
    return null
  }
 
  return (
    <Fragment>
      <IconButton onClick={handleOpen}>
        <FilterAltIcon />
      </IconButton>
      <Dialog fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogHeader label="search_filters" setDialogOpen={setOpen} />
          <HeightAnimator>
            <EweyLayoutHintProvider hint={EweyLayoutHint.LABELS_ALWAYS_ABOVE}>
              <EweyForm 
                schema={schema}
                value={internalParams as JsonObjType} 
                onSetValue={(value) => setInternalParams(value as SearchParams)}
                onSubmit={handleSubmit}
              />
            </EweyLayoutHintProvider>
          </HeightAnimator>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
