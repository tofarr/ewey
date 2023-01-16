import EweyProps from '../EweyProps'
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import EditComponent from '.'

const ObjectComponent = ({ value, schema, path, setValue}: EweyProps) => {
  if (schema.type !== 'object') {
    return null
  }
  const { properties } = schema

  function createSetHandler(key: string) {
    return function(val: any) {
      const newValue = { ...value }
      newValue[key] = val
      setValue(newValue)
    }
  }

  return (
    <Paper>
      <Box p={1} textAlign="left">
        <Box pb={2}>
          <Typography variant="h3">{keyToLabel(schema.name)}</Typography>
        </Box>
        {Object.keys(properties).map(k =>
          <Box key={k} sx={{ paddingBottom: { xs: 1, md: 2 }}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={3}>
                <Grid container sx={{
                  justifyContent: { sm: "flex-start", md: "flex-end" },
                }}>
                  <Grid item>
                    <Box pt={2}>
                      <FormLabel>{keyToLabel(k)}</FormLabel>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={9}>
                <EditComponent value={value[k]} schema={properties[k]} path={[...path, k]} setValue={createSetHandler(k)} />
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Paper>
  )
}

export const keyToLabel = (key: string) => {
  return key.split('_').map(p => p[0].toUpperCase() + p.substr(1)).join(' ')
}

export default ObjectComponent
