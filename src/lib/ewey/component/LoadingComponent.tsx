
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

export const LoadingComponent = () => {
  return (
    <Paper>
      <Box display="flex" justifyContent="center" alignItems="center" padding={3}>
        <CircularProgress />
      </Box>
    </Paper>
  )
}

export default LoadingComponent
