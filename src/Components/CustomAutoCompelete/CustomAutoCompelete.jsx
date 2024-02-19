import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import React, { memo, useEffect, useState } from 'react'
import APIManager from '../../utils/ApiManager';

const ApiManager = new APIManager();

function CustomAutoCompelete({url,disable=false,onChange,lable,value,getOptionLabel,readOnly=false,filterOnActive,options,saveData,inputRef,onInputChange,onBlur,hasError,isOptionEqualToValue,fullWidth,disableClearable,clearOnEscape,additionOptions=[]}) {
    const [Loading, setLoading] = useState(false);
    const [RealOptios, setRealOptios] = useState([]);

    useEffect(()=> {
    if(disable) return;
        if(options)
        {
            setRealOptios(options);
            setLoading(false);
        }
        else
        {
            setLoading(true);
            const getOptions = async () => {
                const data = await ApiManager.get(`${url}`);
                if(!data.error) {
                    saveData && saveData(data.data.data);
                    if(filterOnActive)
                    {
                      // setRealOptios(...data.data.data.filter(item=>item?.isActive),...additionOptions);
                      setRealOptios(data.data.data.filter(item=>item?.isActive));
                    } else {
                      // setRealOptios([...data.data.data,...additionOptions]);
                      setRealOptios(data.data.data);
                    }
                }
                setLoading(false);
            }
            getOptions();
        }
    },[options,url,disable]); 
  return (
    <Autocomplete
    clearOnEscape={clearOnEscape}
    autoComplete
    autoHighlight
    blurOnSelect
    clearOnBlur
    disableClearable={disableClearable}
    fullWidth={fullWidth}
    options={RealOptios}
    value={value} 
    loading={Loading}
    onBlur={onBlur}
    isOptionEqualToValue={isOptionEqualToValue}
    onChange={(event,newValue) => {
      onChange && onChange(newValue);
    }}
    onInputChange={(event,newValue) => {
      onInputChange && onInputChange(newValue);
    }}
    renderInput={(params) => (
      <TextField
        {...params} 
        sx={{
          "& label.Mui-focused": {
            color: hasError ? "" : "#25396f",
          },
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: hasError ? "red" : "#25396f",
            },
          },
        }}
        label={lable}
        inputRef={inputRef}
        error={!!hasError}
        InputProps={{ 
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {Loading ? (
                <CircularProgress color="inherit" size={20} />
              ) : null}
              {params.InputProps.endAdornment}
            </React.Fragment>
          )
        }}
      />
    )}
    readOnly={readOnly}
    getOptionLabel={getOptionLabel || null}
    disabled={disable}
  />
  )
}

export default memo(CustomAutoCompelete);