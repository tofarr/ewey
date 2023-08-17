import { FC, useState } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import JsonSchemaComponentFactory from '../JsonSchemaComponentFactory';

export interface OAuthLoginFormProps {
  url: string
}

const FormComponent = JsonSchemaComponentFactory({
  type: "object",
  name: "Login",
  properties: {
    username: {type: "string"},
    password: {type: "string"}
  }
}, {})

const OAuthLoginForm: FC<OAuthLoginFormProps> = ({ url }) => {
  const [login, setLogin] = useState({username: "", password: ""})

  function handleLogin() {
    alert('login')
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs md={8} lg={6}>
        <Paper>
          <Box pt={2} pr={4} pb={2} pl={4}>
            <FormComponent value={login} onSetValue={setLogin} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default OAuthLoginForm
