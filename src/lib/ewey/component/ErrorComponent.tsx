import { FC } from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export interface ErrorComponentProperties {
  message?: string
}

const ErrorComponent: FC<ErrorComponentProperties> = ({ message }) => {
  return (
    <Paper>
      <Grid container justifyContent="center" alignItems="center" spacing={1} padding={3}>
        <Grid item>
          <ErrorIcon color="error" fontSize="large" />
        </Grid>
        {message && <Grid item>
          <Typography>{message}</Typography>
        </Grid>}
      </Grid>
    </Paper>
  )
}

export default ErrorComponent
