import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps, SelectChangeEvent } from "@mui/material/Select";

const PAGE_SIZES = [5, 10, 20, 50, 100]

export interface CrudPaginatorProps {
  pageKey: string | null;
  nextPageKey: string | null;
  onSetPageKey: (pageKey: string | null) => void;
  pageSizes?: number[];
  pageSize: number;
  onSetPageSize: (pageSize: number) => void;
}

const CrudPaginator = ({
  pageKey,
  nextPageKey,
  onSetPageKey,
  pageSizes,
  pageSize,
  onSetPageSize,
}: CrudPaginatorProps) => {
  if (!pageSizes) {
    pageSizes = PAGE_SIZES;
  }
  if (!pageSize) {
    pageSize = PAGE_SIZES[0];
  }

  return (
    <Grid container>
      <Grid item>
        <Button
          disabled={!!pageKey}
          onClick={() => onSetPageKey(null)}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
      </Grid>
      <Grid item>
        <Select 
          value={pageSize.toString()} 
          onChange={(event: SelectChangeEvent) => onSetPageSize(parseInt(event.target.value))}
        >
          {pageSizes.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </Select>
      </Grid>
      <Grid item>
        <Button
          disabled={!!nextPageKey}
          onClick={() => onSetPageKey(nextPageKey)}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
      </Grid>
    </Grid>
  )
}

export default CrudPaginator;
