import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EweyField from './EweyField';
import JsonType, { JsonObjectType } from './JsonType';
import { keyToLabel } from './FieldSetWrapper';


export interface Column {
  key: string
  Field: EweyField<JsonType>
}

interface CellProps {
  column: Column
  value: JsonObjectType
  onSetValue?: ((value: JsonObjectType) => void) | null
}

const Cell = ({column, value, onSetValue}: CellProps) => {
  return (
    <TableCell key={column.key}>
      <column.Field
        value={value[column.key]}
        onSetValue={onSetValue ? (newColumnValue => {
          const newValue = {...value }
          newValue[column.key] = newColumnValue as JsonType
          onSetValue(newValue)
        }) : undefined}
      />
    </TableCell>
  )
}

interface RowProps {
  columns: Column[]
  rowIndex: number
  value: JsonObjectType[]
  onSetValue: ((value: JsonObjectType[]) => void) | null
}

const Row = ({ columns, rowIndex, value, onSetValue}: RowProps) => {
  return (
    <TableRow key={rowIndex}>
      {columns.map(column => (
        <Cell
          column={column}
          value={value[rowIndex] as JsonObjectType}
          onSetValue={onSetValue ? ((newValue: JsonObjectType) => {
            const newValues = value.slice()
            newValues[rowIndex] = newValue
            onSetValue(newValues)
          }) : null}
        />
      ))}
    </TableRow>
  )
}

const TableWrapper = (columns: Column[]): EweyField<JsonObjectType[]> => {

  const TableField: EweyField<JsonObjectType[]> = ({value, onSetValue}) => {
    const { t } = useTranslation()
    return (
      <Table>
        <TableHead>
          {columns.map(column => (
            <TableCell key={column.key}>
              {t(column.key, keyToLabel(column.key))}
            </TableCell>
          ))}
        </TableHead>
        <TableBody>
          {(value || []).map((v, index) => {
            return (
              <Row columns={columns} rowIndex={index} value={value as JsonObjectType[]} onSetValue={onSetValue as ((value: JsonObjectType[]) => void) | null} />
            )
          })}
        </TableBody>
      </Table>
    )
  }
  return TableField
}

export default TableWrapper
