import TableHead from "@mui/material/TableHead";
import { HeadProps } from "../../../eweyField/TableWrapper";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { getLabel } from "../../../label";
import { useTranslation } from "react-i18next";

export default function DataResultSetHead({ columns }: HeadProps) {
  const { t } = useTranslation()
  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {columns.map(column => (
          <TableCell key={column.key}>
            {getLabel(column.key, t)}
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}
