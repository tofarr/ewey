import Grid from "@mui/material/Grid"
import Fab from "@mui/material/Fab"
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import JsonType, { JsonObjectType } from "../eweyField/JsonType"
import OpenApiForm from "../openApi/OpenApiForm"
import { useOpenApi } from "../openApi/OpenApiProvider"
import OpenApiQuery from "../openApi/OpenApiQuery"
import { useOAuthBearerToken } from "../oauth/OAuthBearerTokenProvider"
import OpenApiQueryContent from "../openApi/OpenApiQueryContent"
import { EweyFactoryProvider, useEweyFactories } from "../providers/EweyFactoryProvider"
import EweyFactory from "../eweyFactory/EweyFactory"
import { AnySchemaObject } from "ajv"
import { ComponentSchemas, resolveRef } from "../ComponentSchemas"
import EweyField from "../eweyField/EweyField"
import JsonSchemaFieldFactory from "../JsonSchemaFieldFactory"
import { getLabel } from "../label"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom";
import { useMessageBroker } from "../message/MessageBrokerContext";

export interface PersistyItemProps {
  store: string
  itemKey: string
  edit: boolean
}

const PersistyItem = ({ store, itemKey, edit }: PersistyItemProps) => {
  const openApi = useOpenApi()
  const updateOperation = openApi.operations.find(op => op.operationId === `${store}_update`)
  const token = useOAuthBearerToken()
  const updatable = updateOperation && (!updateOperation.requiresAuth || token?.token);
  const searchable = !!openApi.operations.find(op => op.operationId === `${store}_search`)  
  const factories = useEweyFactories()
  const { t } = useTranslation()
  const navigate = useNavigate();
  const messageBroker = useMessageBroker();

  if (!edit) {
    return (
      <Grid container padding={2} spacing={3} direction="column">
        <Grid item>
          <Typography variant="h4">{getLabel(store, t)}</Typography>  
        </Grid>
        <Grid item>
          <OpenApiQueryContent operationId={`${store}_read`} params={{ key: itemKey}} />
        </Grid>
        <Grid item>
          <Grid container justifyContent="flex-end" spacing={2}>
            { searchable &&
              <Grid item>
                <Link to="">
                  <Fab>
                    <CloseIcon />
                  </Fab>
                </Link>
              </Grid>
            }
            {updatable && 
              <Grid item>
                <Link to={`?key=${itemKey}&edit=1`}>
                  <Fab>
                    <EditIcon />
                  </Fab>
                </Link>
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    )
  }

  function createInitialValues(readResult: JsonObjectType){
    if (!updateOperation){
      throw new Error('illegal_state')
    }
    const { paramsSchema } = updateOperation
    const properties = resolveRef(paramsSchema.properties.item, paramsSchema.components).properties
    const item: JsonObjectType = {}
    for (const key in readResult){
      if (properties[key]){
        item[key] = readResult[key]
      }
    }
    return {item, key: itemKey}
  }

  return (
    <OpenApiQuery operationId={`${store}_read`} params={{ key: itemKey}}>
      {(item) => (
        <EweyFactoryProvider factories={[...factories, new ItemWrapperFactory()]}>
          <OpenApiForm
            operationId={`${store}_update`} 
            value={createInitialValues(item as JsonObjectType)}
            cancelElement={
              <Link to={`?key=${itemKey}`}>
                <Fab>
                  <CloseIcon />
                </Fab>
              </Link>
            }
            onSuccess={() => {
              messageBroker.triggerMessage(getLabel('update_successful', t))
              navigate(`?key=${itemKey}`)
            }}
          />
        </EweyFactoryProvider>
      )}
    </OpenApiQuery>
  )
}

class ItemWrapperFactory implements EweyFactory {
  
  priority: number = 500

  create(schema: AnySchemaObject, components: ComponentSchemas, currentPath: string[], factories: EweyFactory[], parents: AnySchemaObject[]): EweyField<any> | null | undefined {
    if (currentPath.length || !schema.properties?.item) {
      return null
    }
    schema = resolveRef(schema, components)

    const field = JsonSchemaFieldFactory(
      schema.properties.item,
      components,
      [...currentPath, 'item'],
      factories,
    );
    return ItemFieldWrapper(field)
  }
}

const ItemFieldWrapper = (Field: EweyField<JsonType>) => {
  const ItemField: EweyField<JsonObjectType> = ({ path, value, onSetValue }) => {
    return <Field
      path={[...(path || []), 'item']}
      value={value.item}
      onSetValue={onSetValue ? ((item) => onSetValue({...value, item})) : undefined}
    />
  }
  return ItemField
}

export default PersistyItem
