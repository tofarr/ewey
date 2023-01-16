import { Fragment, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import EweyProps from '../EweyProps';

const FORMATS = ['date-time', 'date']

const DateTimeComponent = ({ value, schema, setValue }: EweyProps) => {
  const [displayValue, setDisplayValue] = useState<Dayjs | null>(dayjs(value));
  if (schema.type !== 'string' || !FORMATS.includes(schema.format)) {
    return null
  }
  const Picker = schema.format == 'date' ? DatePicker : DateTimePicker

  function handleChange(date: Dayjs | null){
    const dateStr = date ? date.toDate().toISOString() : null
    setValue(dateStr)
    if (dateStr) {
      setDisplayValue(dayjs(dateStr))
    }else{
      setDisplayValue(null)
    }
  }

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Picker
              value={displayValue}
              onChange={handleChange}
              renderInput={(params: any) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleChange(null)}><ClearIcon /></IconButton>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Fragment>
  );
}

export default DateTimeComponent
