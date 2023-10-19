import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreIcon from '@mui/icons-material/More';
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Cell, RowProps } from "../../../eweyField/TableWrapper";
import Result from "../../Result";
import usePersistyOperations from "../../PersistyOperationsProvider";
import { useOAuthBearerToken } from "../../../oauth/OAuthBearerTokenProvider";
import LockableLink from "../LockableLink";
import DeleteDialog from '../DeleteDialog';
import { isLocked } from "../../../oauth/utils";


export function ResultSetRow({ 
  path,
  columns,
  rowIndex,
  value,
  cellType,
}: RowProps) {
  const CellComponent = cellType || Cell
  const result = value[rowIndex] as unknown as Result
  const { deleteOp, readOp } = usePersistyOperations()
  const navigate = useNavigate()
  const token = useOAuthBearerToken()
  
  return (
    <TableRow key={`tableRow/${rowIndex}`}>
      {columns.map((column, columnIndex) => (
        <CellComponent
          key={`tableCell/${rowIndex}/${columnIndex}`}
          path={[...path, rowIndex.toString(), column.key]}
          column={column}
          value={result.item}
        />
      ))}
      <TableCell>
        <Grid container direction="row" spacing={1} justifyContent="flex-end">
          {readOp && 
            <Grid item>
              <LockableLink
                to={`?key=${encodeURIComponent(result.key)}`}
                locked={isLocked(readOp, token)}
              >
                <IconButton>
                  <MoreIcon />
                </IconButton>
              </LockableLink>
            </Grid>
          }
          {deleteOp &&
            <Grid item>
              <DeleteDialog result={result} onDelete={() => navigate("")}>
                {(isLoading, disabled, setDialogOpen) => (
                <IconButton 
                    disabled={disabled} 
                    onClick={() => setDialogOpen(true)}
                  >
                    {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                )}
              </DeleteDialog>
            </Grid>
          }
        </Grid>
      </TableCell>

    </TableRow>
  )
};
