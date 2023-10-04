import Box from "@mui/material/Box"
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import EweyField from "../eweyField/EweyField";
import { AnySchemaObject } from "../schemaCompiler";
import { useOpenApi } from "../openApi/OpenApiProvider";
import { PersistyInfoButton } from "./PersistyInfoButton";
import { PersistyDeleteButton } from "./PersistyDeleteButton";
import { ResultSet } from "./ResultSet";
import { Result } from "./Result";
import { Cell, Column } from "../eweyField/TableWrapper";
import { useTranslation } from "react-i18next";
import { getLabel } from "../label";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";


export interface RowProps {
  path: string[];
  columns: Column[];
  rowIndex: number;
  value: Result[];
  ActionField?: EweyField<Result> | null
}

export const ResultSetRow = ({ path, columns, rowIndex, value, ActionField }: RowProps) => {
  const result = value[rowIndex]
  const { item } = result

  const cells = columns.map((column, columnIndex) => (
    <Cell
      key={`tableCell/${rowIndex}/${columnIndex}`}
      path={[...path, rowIndex.toString(), column.key]}
      column={column}
      value={item}
    />
  ))
  if (ActionField) {
    cells.push(
      <TableCell key={`actions/${rowIndex}`} align="right">
        <ActionField value={result} />
      </TableCell>
    )
  }
  return (
    <TableRow key={`tableRow/${rowIndex}`}>
      {cells}
    </TableRow>
  );
};

const PersistyResultSetWrapper = (columns: Column[], actionField?: EweyField<Result>): EweyField<ResultSet> => {
  const ResultSetField: EweyField<ResultSet> = ({ path, value }) => {
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
            {value.results.map((v, index) => {
              return (
                <ResultSetRow
                  key={`row${index}`}
                  path={path as string[]}
                  columns={columns}
                  rowIndex={index}
                  value={value.results}
                  ActionField={actionField}
                />
              );
            })}
          </TableBody>
        </Table>
      </Box>
    )
  }
  return ResultSetField
}

export default PersistyResultSetWrapper
