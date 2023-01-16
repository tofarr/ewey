import EweyProps from '../EweyProps'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import Typography from '@mui/material/Typography';

TimeAgo.addDefaultLocale(en)
const TIME_AGO = new TimeAgo('en-US') // I was hoping for a default here

const DateTimeComponent = ({ value, schema }: EweyProps) => {
  if (value && schema.type === 'string' && schema.format === 'date-time') {
    const dateTime = new Date(value)  // value is an iso formatted date
    return (
      <Typography variant="body1" title={dateTime.toLocaleString()}>
        {getTimeStr(dateTime)}
      </Typography>
    )
  }
  return null
}

function getTimeStr(dateTime: Date) {
  if (dateTime.getTime() < new Date().getTime()){
    if ((navigator.language || '').startsWith('en')) {
      return TIME_AGO.format(dateTime)
    }
  }
  return dateTime.toLocaleString()
}

export default DateTimeComponent
