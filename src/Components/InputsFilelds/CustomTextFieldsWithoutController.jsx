import TextField from "@mui/material/TextField";

export const CustomTextInputFieldWithoutController = ({  label,readOnly,required,disable,type,focused,inputPropsText={},InputPropsText={},onKeyDown=()=>null,onPaste=()=>null,onChange:ownOnchange=()=>null,value,onBlur,error }) => {
  return (
        <TextField
        sx={{  "& label.Mui-focused": {
          color: error ? "" : "#25396f"
        }, "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: error ? "" : "#25396f"
          }
        }}}
          type={ type || "text"}
          helperText={error?.message}
          onBlur={onBlur}
          autoFocus={focused}
          size="medium"
          onKeyDown={onKeyDown}
          error={!!error}
          onChange={(e) => {ownOnchange(e)}}
          onPaste={onPaste}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          required={required}
          disabled={disable}
          inputProps={inputPropsText}
          InputProps={InputPropsText}
        />
  );
};