import { FC, Fragment } from 'react';
import { useOpenApiSchema } from './OpenApiSchemaContext';
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
    <Fragment>{operations.map(({ path, method }) =>
      <OpenApiForm key={method+path} path={path} method={method} initialValue={{}} />
    )}</Fragment>
  )
}

export default OpenApiSummary
