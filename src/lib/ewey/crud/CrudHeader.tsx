import Grid from "@mui/material/Grid"

export interface CrudHeaderProps {

}

const CrudHeader = ({}: CrudHeaderProps) => {

  return (
    <Grid container>
      <Grid item>
        Filters
      </Grid>
      <Grid item>
        Count
      </Grid>
      <Grid item>
        Paginator
      </Grid>
    </Grid>
  )
}

export default CrudHeader;
