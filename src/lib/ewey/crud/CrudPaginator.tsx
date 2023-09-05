import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const LIMITS = [5, 10, 20, 50, 100]

export interface CrudPaginatorProps {
  pageKey?: string | null;
  nextPageKey?: string | null;
  onSetPageKey: (pageKey: string | null) => void;
  limits?: number[];
  limit?: number | null;
  onSetLimit: (limit: number) => void;
}

const CrudPaginator = ({
  pageKey,
  nextPageKey,
  onSetPageKey,
  limits,
  limit,
  onSetLimit,
}: CrudPaginatorProps) => {
  if (!limits) {
    limits = LIMITS;
  }
  if (!limit) {
    limit = LIMITS[0];
  }

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <Button
          disabled={!pageKey}
          variant="outlined"
          onClick={() => onSetPageKey(null)}
        >
          <KeyboardDoubleArrowLeftIcon />
        </Button>
      </Grid>
      <Grid item>
        <Select 
          value={limit.toString()} 
          onChange={(event: SelectChangeEvent) => onSetLimit(parseInt(event.target.value))}
        >
          {limits.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </Select>
      </Grid>
      <Grid item>
        <Button
          disabled={!nextPageKey}
          variant="outlined"
          onClick={() => onSetPageKey(nextPageKey as string)}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </Grid>
    </Grid>
  )
}

export default CrudPaginator;
