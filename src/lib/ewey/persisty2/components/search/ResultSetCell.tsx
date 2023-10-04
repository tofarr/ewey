import TableCell from "@mui/material/TableCell";
import { JsonObjectType } from "../../../eweyField/JsonType";
import { CellProps } from "../../../eweyField/TableWrapper";

export function ResultSetCell({ column, path, value, onSetValue }: CellProps) {
  const item = value.item as JsonObjectType
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
