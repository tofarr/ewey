import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const OAuthLoginRequired = () => {
  return (
    <Snackbar>
      <Alert severity="error" sx={{ width: '100%' }}>
        Login to Continue
      </Alert>
    </Snackbar>
  )
}

export default OAuthLoginRequired
