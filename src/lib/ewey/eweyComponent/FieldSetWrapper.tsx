import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import EweyComponent from './EweyComponent';

const FieldSetWrapper = (name: string, componentsByKey: any) => {

  const FieldSetComponent: EweyComponent<any> = ({value, onSetValue}) => {
    const { t } = useTranslation()

    function renderField(key: string){
      const Component = componentsByKey[key]
      const fieldValue = value[key]
      let onSetFieldValue = null
      if (onSetValue) {
        onSetFieldValue = (newFieldValue: any) => {
          const newValue = {...value}
          newValue[key] = newFieldValue
          onSetValue(newValue)
        }
      }
      return (
        <Box key={key} sx={{ paddingBottom: { xs: 1, md: 2 }}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={3}>
              <Grid container sx={{
                justifyContent: { sm: "flex-start", md: "flex-end" },
              }}>
                <Grid item>
                  <Box pt={2}>
                    <FormLabel>{t(key, keyToLabel(key))}</FormLabel>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={9}>
              <Component value={fieldValue} onSetValue={onSetFieldValue} />
            </Grid>
          </Grid>
        </Box>
      )
    }

    return (
      <Box p={1} textAlign="left">
        {name && <Box pb={2}>
          <Typography variant="h3">{t(name, keyToLabel(name))}</Typography>
        </Box>}
        {Object.keys(componentsByKey).map(renderField)}
      </Box>
    )
  }

  return FieldSetComponent

}

function keyToLabel(key: string) {
  return key.split('_').map(p => p[0].toUpperCase() + p.substr(1)).join(' ')
}

export default FieldSetWrapper
