import { FC, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { useOpenApiSchema } from './OpenApiSchemaContext';
import OpenApiContent from './OpenApiContent';
import OpenApiForm from './OpenApiForm';

interface OpenApiOperation {
  path: string
  method: string
}

const OpenApiSummary: FC = () => {
  const schema = useOpenApiSchema()
  const operations = getOperations()

  function getOperations(){
    const operations: OpenApiOperation[] = []
    const paths = schema.schema.paths
    for (const path in paths){
      for (const method in paths[path]) {
        operations.push({ path, method })
      }
    }
    return operations
  }

  return (
    <Grid container spacing={1} direction="column">
      {operations.map(OpenApiOperationItem)}
    </Grid>
  )
}

const OpenApiOperationItem = ({ method, path }: OpenApiOperation) => {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState(null)
  return (
    <Grid key={method + path} item>
      <OpenApiForm path={path} method={method} initialValue={{}} onSuccess={(r) => {
        setResult(r)
        setOpen(true)
      }} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogContent>
          <OpenApiContent
            path={path}
            method={method}
            value={result} />
        </DialogContent>
      </Dialog>
    </Grid>
  )
}

export default OpenApiSummary
