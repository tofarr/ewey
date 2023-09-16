import { useTranslation } from "react-i18next";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EweyField from "./EweyField";
import JsonType, { JsonObjectType } from "./JsonType";
import { getLabel } from "../label";
import Box from "@mui/material/Box";

export interface Column {
  key: string;
  Field: EweyField<JsonType>;
}

interface CellProps {
  column: Column;
  path: string[]
  value: JsonObjectType;
  onSetValue?: ((value: JsonObjectType) => void);
}

const Cell = ({ column, path, value, onSetValue }: CellProps) => {
  return (
    <TableCell key={column.key}>
      <column.Field
        path={path}
        value={value[column.key]}
        onSetValue={
          onSetValue
            ? (newColumnValue) => {
                const newValue = { ...value };
                newValue[column.key] = newColumnValue as JsonType;
                onSetValue(newValue);
              }
            : undefined
        }
      />
    </TableCell>
  );
};

interface RowProps {
  path: string[];
  columns: Column[];
  rowIndex: number;
  value: JsonObjectType[];
  onSetValue: ((value: JsonObjectType[]) => void) | null;
  ActionField?: EweyField<JsonObjectType> | null
}

const Row = ({ path, columns, rowIndex, value, onSetValue, ActionField }: RowProps) => {
  const rowValue = value[rowIndex] as JsonObjectType

  const handleSetRowValue = onSetValue ? (newValue: JsonObjectType) => {
    const newValues = value.slice();
    newValues[rowIndex] = newValue;
    onSetValue(newValues);
  } : undefined
  
  const cells = columns.map((column, columnIndex) => (
    <Cell
      key={`tableCell/${rowIndex}/${columnIndex}`}
      path={[...path, rowIndex.toString(), column.key]}
      column={column}
      value={rowValue}
      onSetValue={handleSetRowValue}
    />
  ))
  if (ActionField) {
    cells.push(
      <TableCell key={`actions/${rowIndex}`} align="right">
        <ActionField value={rowValue} onSetValue={handleSetRowValue} />
      </TableCell>
    )
  }
  return (
    <TableRow key={`tableRow/${rowIndex}`}>
      {cells}
    </TableRow>
  );
};

const TableWrapper = (columns: Column[], actionField?: EweyField<JsonObjectType> | null): EweyField<JsonObjectType[]> => {
  const TableField: EweyField<JsonObjectType[]> = ({ path, value, onSetValue }) => {
    const { t } = useTranslation();
    if(path == null){
      path = [];
    }
    const headCells = columns.map((column) => (
      <TableCell key={column.key}>
        {getLabel(column.key, t)}
      </TableCell>
    ))
    if (actionField){
      headCells.push(<TableCell key="/actions"></TableCell>);
    }
    return (
      <Box overflow="auto">
        <Table>
          <TableHead>
            <TableRow>
              {headCells}
            </TableRow>
          </TableHead>
          <TableBody>
            {(value || []).map((v, index) => {
              return (
                <Row
                  key={`row${index}`}
                  path={path as string[]}
                  columns={columns}
                  rowIndex={index}
                  value={value as JsonObjectType[]}
                  onSetValue={
                    onSetValue as ((value: JsonObjectType[]) => void) | null
                  }
                  ActionField={actionField}
                />
              );
            })}
          </TableBody>
        </Table>
      </Box>
    );
  };
  return TableField;
};

export default TableWrapper;
