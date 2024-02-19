import React from 'react'
import { Controller } from "react-hook-form";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function CustomDatePickerField({ name, control, label, required,rules,disable,focused,maxDate,inputProps={},minDate,format }) {
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

        <DatePicker 
        sx={{  "& label.Mui-focused": {
            color: error ? "" : "#25396f"
          }, "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: error ? "" : "#25396f"
            }
          }}}
        label={label}
        disabled={disable}
        format={format}
        autoFocus={focused}
        onChange={onChange}
        maxDate={ maxDate && dayjs(maxDate)}
        minDate={ minDate && dayjs(minDate)}
        value={dayjs(value)}
        slotProps={{
            textField: {
                fullWidth: true,
                helperText: error?.message && error?.message ,
                error: !!error,
                onBlur: onBlur,
                required: required,
                inputProps:inputProps},   
        }}
        />
        </LocalizationProvider>

       )}
    /> 
  )
}

export default CustomDatePickerField

