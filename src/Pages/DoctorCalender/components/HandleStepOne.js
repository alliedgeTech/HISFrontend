import React, { useEffect } from 'react'
import Hclasses from "./handleStepOne.module.css"
import { useDispatch, useSelector } from "react-redux";
import { useForm,Controller } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import { Box,Typography } from '@mui/material';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import CustomButton from '../../../Components/Button/Button';
import { setCity, setLocation, setStep } from '../../../slices/doctorCalender.slice';

function HandleStepOne() {
    const { city,location } = useSelector(state=>state.doctorCalender);
    const dispatch = useDispatch();
    var { handleSubmit, formState: { errors },reset,control,watch } = useForm({
        defaultValues: {
          city: city,
          location: location,
        },
        mode:'onTouched'
      });

    const watchCity = watch("city");
    
    const submitData = (data) => { 
        dispatch(setLocation(data.location));
        dispatch(setCity(data.city));
        dispatch(setStep(2));
    }

  return (
    <div className={Hclasses.container}>

      <div className={Hclasses.Box}>
        <Typography className={Hclasses.cusTypogrphy} >Select City & Branch</Typography>
           <Box
           width={'100%'} 
          component="form"
          onSubmit={handleSubmit(submitData)}
          p={1}
        >
            <Grid 
                container
                spacing={{ md:3 ,xs:2  }}
                // columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="space-between"
                alignItems="center" 
              > 
                 <Grid item xs={12} md={6}>
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: {value:true,message:"City is required"} }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select City"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.cityName}
                            url={"admin/regionMaster/city"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                            errors.city && <Typography variant="caption" color="error">City is required</Typography> 
                        }
                    </Grid>

                <Grid xs={12} sm={6}>
                    <Controller
                    name="location"
                    control={control}
                    rules={{ required: 'branch is required' }}
                    render={({ field,fieldState: { error } }) => {
                      const {onChange,value,ref,onBlur} = field; 
                    return <CustomAutoCompelete 
                    onChange={onChange}
                    lable={"Select Branch"}
                    hasError={error}
                    value={value}
                    onBlur={onBlur}
                    disable={!!!watchCity}
                    inputRef={ref}
                    getOptionLabel={(option)=> option.location }
                    url={`admin/locationMaster/getlocation/d?city=${watchCity?._id}`}
                    /> 
                  }}
                    />
                    {
                      errors.isActive && <Typography variant="caption" color="error">IsActive is required</Typography> 
                    }
                </Grid>
              </Grid>
              <div className={Hclasses.btnContainer}>
              <CustomButton buttonText={"Back"} disabled />
              <CustomButton buttonText={"Next"} type={"submit"} />
        </div>
          </Box>
      </div>
    </div>
  )   
}

export default HandleStepOne