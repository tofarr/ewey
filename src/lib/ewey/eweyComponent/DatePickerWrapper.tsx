import EweyComponent from './EweyComponent';
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
import ClearIcon from '@mui/icons-material/Clear';

const DatePickerWrapper = (validator: Validator, format: string): EweyComponent<string | null> => {
  const DatePickerComponent: EweyComponent<string | null> = ({value, onSetValue}) => {
    const [displayValue, setDisplayValue] = useState<Dayjs | null>(dayjs(value));
    const Picker = format === 'date' ? DatePicker : DateTimePicker
    const validationResult = validator.validate(value || null)

    function handleChange(newValue?: Dayjs | null){
      const dateStr: any = newValue ? newValue.toDate().toISOString() : null;
      (onSetValue as any)(dateStr)
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
                disabled={!onSetValue}
                value={displayValue}
                onChange={handleChange}
                renderInput={(params: any) => <TextField {...params} error={!validationResult.valid} />}
              />
            </Grid>
            {onSetValue && <Grid item>
              <IconButton onClick={() => handleChange(null)}><ClearIcon /></IconButton>
            </Grid>}
          </Grid>
        </LocalizationProvider>
      </Fragment>
    );
  }
  return DatePickerComponent
}

export default DatePickerWrapper
