import EweyProps from '../EweyProps'
import Typography from '@mui/material/Typography';


const DateComponent = ({ value, schema }: EweyProps) => {
  if (value && schema.type === 'string' && schema.format === 'date') {
    let dateTime = new Date(value)  // value is an iso formatted date
    dateTime = new Date(dateTime.getTime() + dateTime.getTimezoneOffset() * 60000)
    return <Typography variant="body1">{dateTime.toLocaleDateString()}</Typography>
  }
  return null
}

export default DateComponent
