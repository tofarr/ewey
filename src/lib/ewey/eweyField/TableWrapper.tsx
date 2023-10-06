import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { JsonObjType, JsonType } from "json-urley";
import EweyField from "./EweyField";
import { getLabel } from "../label";

export interface Column {
  key: string;
  Field: EweyField<JsonType>;
}

export interface CellProps {
  column: Column;
  path: string[]
  value: JsonObjType;
  onSetValue?: ((value: JsonObjType) => void);
}

export const Cell = ({ column, path, value, onSetValue }: CellProps) => {
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

export interface RowProps {
  path: string[];
  columns: Column[];
  rowIndex: number;
  value: JsonObjType[];
  onSetValue: ((value: JsonObjType[]) => void) | null;
  ActionField?: EweyField<JsonObjType> | null
  cellComponent?: (props: CellProps) => JSX.Element
}

export const Row = ({ path, columns, rowIndex, value, onSetValue, cellComponent, ActionField }: RowProps) => {
  const CellComponent = cellComponent || Cell
  const rowValue = value[rowIndex] as JsonObjType

  const handleSetRowValue = onSetValue ? (newValue: JsonObjType) => {
    const newValues = value.slice();
    newValues[rowIndex] = newValue;
    onSetValue(newValues);
  } : undefined
  
  const cells = columns.map((column, columnIndex) => (
    <CellComponent
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

const TableWrapper = (columns: Column[], cellComponent?: (props: CellProps) => JSX.Element, actionField?: EweyField<JsonObjType> | null): EweyField<JsonObjType[]> => {
  const TableField: EweyField<JsonObjType[]> = ({ path, value, onSetValue }) => {
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
                  value={value as JsonObjType[]}
                  onSetValue={
                    onSetValue as ((value: JsonObjType[]) => void) | null
                  }
                  cellComponent={cellComponent}
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
