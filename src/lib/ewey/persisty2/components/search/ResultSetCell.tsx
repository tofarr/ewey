import TableCell from "@mui/material/TableCell";
import { JsonObjType } from "json-urley";
import { CellProps } from "../../../eweyField/TableWrapper";

export function ResultSetCell({ column, path, value, onSetValue }: CellProps) {
  const item = value.item as JsonObjType
  return (
    <TableCell key={column.key}>
      <column.Field
        path={path}
        value={item[column.key]}
        onSetValue={
          onSetValue
            ? (newColumnValue) => {
                const newItem = {...item}
                newItem[column.key] = newColumnValue
                const newValue = {...value, item: newItem}
                onSetValue(newValue);
              }
            : undefined
        }
      />
    </TableCell>
  );
};
