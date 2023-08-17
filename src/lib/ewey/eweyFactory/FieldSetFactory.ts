import FieldSetWrapper from '../eweyField/FieldSetWrapper';
import EweyFactory from './EweyFactory';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';
import JsonSchema from './JsonSchema'

class FieldSetFactory implements EweyFactory {
  inclusive: boolean = false
  fieldNames?: string[]
  priority: number = 100

  constructor(inclusive: boolean = false, fieldNames?: string[], priority: number = 100){
    this.priority = priority
    this.inclusive = inclusive
    this.fieldNames = fieldNames
  }

  create(schema: JsonSchema, components: any, currentPath: string[], factories: EweyFactory[]) {
    if (!schema || schema.type !== 'object') {
      return null
    }
    const componentsByKey: any = {}
    for (const key in schema.properties) {
      if(this.includeField(key)){
        currentPath.push(key)
        componentsByKey[key] = JsonSchemaComponentFactory(schema.properties[key], components, currentPath, factories)
        currentPath.pop()
      }
    }
    const fieldSetComponent = FieldSetWrapper(schema.name, componentsByKey)
    return fieldSetComponent
  }

  includeField(key: string){
    if(!this.fieldNames){
      return true
    }
    return (this.fieldNames.includes(key) === this.inclusive)
  }
}

export default FieldSetFactory
