import EweyField from './EweyField';
import { Validator } from '@cfworker/json-schema';
import { Fragment, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';

const DatePickerWrapper = (validator: Validator, format: string): EweyField<string | null> => {
  const DatePickerComponent: EweyField<string | null> = ({value, onSetValue}) => {
    const [displayValue, setDisplayValue] = useState<Dayjs | null>(dayjs(value));
    const dateOnly = format === 'date'
    const Picker = dateOnly ? DatePicker : DateTimePicker
    const validationResult = validator.validate(value || null)

    function handleChange(newValue?: Dayjs | null){
      const dateStr: string | null = newValue ? newValue.toDate().toISOString() : null;
      (onSetValue as any)(dateStr)
      if (dateStr) {
        setDisplayValue(dayjs(dateStr))
      }else{
        setDisplayValue(null)
      }
    }

    if (!onSetValue){
      if (!value){
        return <Typography></Typography>
      }
      const date = new Date(value)
      if (dateOnly) {
        return <Typography>{date.toLocaleDateString()}</Typography>
      }
      return <Typography>{date.toLocaleString()}</Typography>
    }

    return (
      <Fragment>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Picker
                disabled={!onSetValue}
                value={displayValue}
                onChange={handleChange}
                renderInput={(params: any) => <TextField {...params} error={!validationResult.valid} />}
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
  return DatePickerComponent
}

export default DatePickerWrapper
