import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";


const LIMITS = [5, 10, 20, 50, 100]

export interface PersistyPaginatorProps {
  pageKey?: string | null;
  nextPageKey?: string | null;
  onSetPageKey: (pageKey: string | null) => void;
  limits?: number[];
  limit?: number | null;
  onSetLimit: (limit: number) => void;
}

const PersistyPaginator = ({
  pageKey,
  nextPageKey,
  onSetPageKey,
  limits,
  limit,
  onSetLimit,
}: PersistyPaginatorProps) => {
  if (!limits) {
    limits = LIMITS;
  }
  if (!limit) {
    limit = LIMITS[0];
  }

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item>
        <IconButton
          disabled={!pageKey}
          onClick={() => onSetPageKey(null)}
        >
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
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
        <IconButton
          disabled={!nextPageKey}
          onClick={() => onSetPageKey(nextPageKey as string)}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default PersistyPaginator;
