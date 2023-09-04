import Grid from "@mui/material/Grid"

export interface CrudSearchProps {
  store: string
}

const CrudSearch = ({ store }: CrudSearchProps) => {

  function renderHeader() {
    return (
      <div>Header</div>
    )
  }

  function renderResults() {
    return (
      <div>Results</div>
    )
  }

  function renderFooter() {
    return (
      <div>Footer</div>
    )
  }

  return (
    <Grid container>
      <Grid item>{renderHeader()}</Grid>
      <Grid item>{renderResults()}</Grid>
      <Grid item>{renderFooter()}</Grid>
    </Grid>
  )
}

export default CrudSearch
