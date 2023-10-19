import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
import DataDeleteDialog from "./DataDeleteDialog";
import IconButton from "@mui/material/IconButton";
import LinkIcon from '@mui/icons-material/Link';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import { Cell, RowProps } from "../../../eweyField/TableWrapper";
import Result from "../../Result";
import { useOAuthBearerToken } from "../../../oauth/OAuthBearerTokenProvider";
import usePersistyDataOperations from "../../PersistyDataOperationsProvider";
import FileHandleLink, { FileHandle } from "./FileHandleLink";

export default function DataResultSetRow({ 
  path,
  columns,
  rowIndex,
  value,
  cellType,
}: RowProps) {
  const CellComponent = cellType || Cell
  const result = value[rowIndex] as unknown as Result
  const { storeName, fileDeleteOp, baseUrl } = usePersistyDataOperations()
  const navigate = useNavigate()
  const token = useOAuthBearerToken()
  let downloadUrl = result.item.download_url as string
  if (!downloadUrl.startsWith("http")){
    downloadUrl = baseUrl + downloadUrl;
  }

  return (
    <TableRow key={`tableRow/${rowIndex}`}>
      <TableCell>
        <FileHandleLink storeName={storeName} fileHandle={result.item as unknown as FileHandle} />
      </TableCell>
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
          <Grid item>
            <Link target="_blank" to={downloadUrl}>
              <IconButton>
                <LinkIcon />
              </IconButton>
            </Link>
          </Grid>
          {fileDeleteOp &&
            <Grid item>
              <DataDeleteDialog result={result} onDelete={() => navigate("")}>
                {(isLoading, disabled, setDialogOpen) => (
                  <IconButton 
                    disabled={disabled} 
                    onClick={() => setDialogOpen(true)}
                  >
                    {isLoading ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                )}
              </DataDeleteDialog>
            </Grid>
          }
        </Grid>
      </TableCell>
    </TableRow>
  )
}
