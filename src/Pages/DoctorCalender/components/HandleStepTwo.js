import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setDoctor, setStep } from '../../../slices/doctorCalender.slice';
import { useForm,Controller } from 'react-hook-form';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import Hclasses from "./handleStepOne.module.css"
import { Box,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomButton from '../../../Components/Button/Button';


function HandleStepTwo() {
    const { doctor,city,location } = useSelector(state=>state.doctorCalender);
    console.log("this is branch :" ,location);
    const dispatch = useDispatch();
    var { handleSubmit, formState: { errors },control } = useForm({
        defaultValues: {
          doctor:doctor
        },
        mode:'onTouched'
      });

      const submitData = (data) => { 
        dispatch(setDoctor(data.doctor));
        dispatch(setStep(3));
    }

  return (
    <div className={Hclasses.container}>

    <div className={Hclasses.Box}>
      <Typography className={Hclasses.cusTypogrphy} >Select Doctor</Typography>
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
                        name="doctor"
                        control={control}
                        rules={{ required: 'Doctor is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete 
                        onChange={onChange}
                        lable={"Select Doctor"}
                        value={value}
                        getOptionLabel={(option)=>` ${option?.userName} / ${option?.speciality?.speciality}`}
                        url={`admin/userMaster/user/doctor?city=${city?._id}&branch=${location?._id}`}
                        inputRef={ref}
                        hasError={error}
                        /> 
                        }}
                        > 
                        </Controller>

                        {
                            errors.doctor && <Typography variant="caption" color="error">{errors.doctor.message}</Typography> 
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