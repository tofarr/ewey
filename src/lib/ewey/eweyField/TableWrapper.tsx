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

export function Cell({ column, path, value, onSetValue }: CellProps) {
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
  cellType?: (props: CellProps) => JSX.Element
}

export function Row({ path, columns, rowIndex, value, onSetValue, cellType }: RowProps) {
  const CellComponent = cellType || Cell
  const rowValue = value[rowIndex] as JsonObjType

  const handleSetRowValue = onSetValue ? (newValue: JsonObjType) => {
    const newValues = value.slice();
    newValues[rowIndex] = newValue;
    onSetValue(newValues);
  } : undefined
  
  return (
    <TableRow key={`tableRow/${rowIndex}`}>
      {columns.map((column, columnIndex) => (
        <CellComponent
          key={`tableCell/${rowIndex}/${columnIndex}`}
          path={[...path, rowIndex.toString(), column.key]}
          column={column}
          value={rowValue}
          onSetValue={handleSetRowValue}
        />
      ))}
    </TableRow>
  );
};

export interface HeadProps {
  columns: Column[]
  columnsBefore?: number
  columnsAfter?: number
}

export function Head({ columns }: HeadProps) {
  const { t } = useTranslation()
  return (
    <TableHead>
      <TableRow>{columns.map(column => (
        <TableCell key={column.key}>
          {getLabel(column.key, t)}
        </TableCell>
      ))}</TableRow>
    </TableHead>
  )
}

export default function TableWrapper(columns: Column[], rowType?: (props: RowProps) => JSX.Element, headType?: (props: HeadProps) => JSX.Element): EweyField<JsonObjType[]> {
  const TableField: EweyField<JsonObjType[]> = ({ path, value, onSetValue }) => {
    const { t } = useTranslation();
    if(path == null){
      path = [];
    }

    const RowComponent = rowType || Row
    const HeadComponent = headType || Head
    return (
      <Box overflow="auto">
        <Table>
          <HeadComponent columns={columns} />
          <TableBody>
            {(value || []).map((v, index) => {
              return (
                <RowComponent
                  key={`row${index}`}
                  path={path as string[]}
                  columns={columns}
                  rowIndex={index}
                  value={value as JsonObjType[]}
                  onSetValue={
                    onSetValue as ((value: JsonObjType[]) => void) | null
                  }
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
