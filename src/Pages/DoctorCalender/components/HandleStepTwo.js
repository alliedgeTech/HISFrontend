import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setLocation, setStep } from '../../../slices/doctorCalender.slice';
import { useForm,Controller } from 'react-hook-form';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import Hclasses from "./handleStepOne.module.css"
import { Box,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomButton from '../../../Components/Button/Button';


function HandleStepTwo() {
    const { location,doctor } = useSelector(state=>state.doctorCalender);
    const dispatch = useDispatch();
    var { handleSubmit, formState: { errors },control } = useForm({
        defaultValues: {
          location: location,
        },
        mode:'onTouched'
      });

      const submitData = (data) => { 
        dispatch(setLocation(data.location));
        dispatch(setStep(3));
      }

  return (
    <div className={Hclasses.container}>

    <div className={Hclasses.Box}>
      <Typography className={Hclasses.cusTypogrphy} >Select Branch</Typography>
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
                <Grid xs={12} sm={12}>
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
                    inputRef={ref}
                    filterOnActive={true}
                    getOptionLabel={(option)=> option.location }
                    url={`admin/locationMaster/location/doctor/${doctor._id}`}
                    /> 
                  }}
                    />
                    {
                      errors.location && <Typography variant="caption" color="error">branch is required</Typography> 
                    }
                </Grid>


            </Grid>
            <div className={Hclasses.btnContainer}>
            <CustomButton buttonText={"Back"} onClick={()=>dispatch(setStep(1))} />
            <CustomButton buttonText={"Next"} type={"submit"} />
      </div>
        </Box>
    </div>
  </div>
  )
}

export default HandleStepTwo