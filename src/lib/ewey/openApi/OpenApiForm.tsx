import { FC, FormEvent, useEffect, useState } from 'react';
import { Validator } from '@cfworker/json-schema';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useMutation } from '@tanstack/react-query'
import { useOpenApiSchema } from './OpenApiSchemaContext';
import { invoke, getFormSchema } from './util';
import EweyFactory from './../eweyFactory/EweyFactory';
import JsonSchemaComponentFactory from './../JsonSchemaComponentFactory';
import SubmitComponent, { SubmitComponentProperties } from './../component/SubmitComponent';

export interface OpenApiFormProps {
  path: string,
  method: string,
  factories?: EweyFactory[],
  initialValue?: any,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void,
  FormSubmitComponent?: FC<SubmitComponentProperties>
}

const OpenApiForm: FC<OpenApiFormProps> = ({
  path,
  method,
  factories,
  initialValue,
  onSuccess,
  onError,
  FormSubmitComponent
}) => {
  if (!FormSubmitComponent) {
    FormSubmitComponent = SubmitComponent
  }
  const schema = useOpenApiSchema()
  const [value, setValue] = useState<any>(initialValue || {})
  const validator = new Validator(schema)
  const { valid } = validator.validate(value)
  const [FormComponent, setFormComponent] = useState<any>(null)
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      try{
        const result = await invoke(schema, path, method, value)
        if (onSuccess) {
          onSuccess(result)
        }
        return result
      } catch(e) {
        if (onError) {
          onError(e)
        }
        throw e
      }
    }
  })
  useEffect(() => {
    const operationSchema = getFormSchema(schema, path, method)
    const components = schema.schema.components
    const c = JsonSchemaComponentFactory(operationSchema, components, factories)
    setFormComponent(() => c)
  }, [path, method, schema, factories])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    handleInvoke()
  }

  function handleInvoke() {
    if (isLoading || !valid) {
      return
    }
    mutate()
  }

  if (!FormComponent) {
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <Paper>
        <Box padding={1} marginBottom={1}>
          <FormComponent value={value} onSetValue={setValue} />
        </Box>
        <FormSubmitComponent submitting={isLoading} valid={valid} onSubmit={handleInvoke} />
      </Paper>
    </form>
  )
}

export default OpenApiForm
