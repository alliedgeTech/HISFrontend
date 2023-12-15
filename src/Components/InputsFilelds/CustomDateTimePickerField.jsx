import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React from 'react'
import { Controller } from "react-hook-form";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function CustomDateTimePickerField({ name, control, label, required,rules,disable,focused,maxDate }) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({
        field: { onChange, value ,onBlur},
        fieldState: { error }
      }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>

        <DateTimePicker 
        sx={{  "& label.Mui-focused": {
            color: error ? "" : "#25396f"
          }, "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: error ? "" : "#25396f"
            }
          }}}
        label={label}
        disabled={disable}
        autoFocus={focused}
        onChange={onChange}
        maxDateTime={dayjs(maxDate)}
        value={dayjs(value)}
        slotProps={{
            textField: {
                helperText: error?.message && error?.message ,
                error: !!error,
                onBlur: onBlur,
                required: required,
            },
        }}
        />
        </LocalizationProvider>

       )}
    /> 
  )
}

export default CustomDateTimePickerField
