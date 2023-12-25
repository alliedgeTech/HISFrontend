import React from 'react'
import HandleStepOne from './components/HandleStepOne';
import { useSelector } from "react-redux";
import HandleStepTwo from './components/HandleStepTwo';
import CustomButton from '../../Components/Button/Button';
import { Typography } from "@mui/material"
import {useNavigate} from 'react-router-dom';
import DoctorSlotsByDate from './components/DoctorSlotsByDate';

function DoctorCalender() {
    const { step } = useSelector(state=>state.doctorCalender);
    const Navigate = useNavigate();
    if(step==1)
    {
        return <HandleStepOne />
    } else if(step==2)
    {
      return <HandleStepTwo />
    } else if(step==3) {
      return <DoctorSlotsByDate/>
    }
  return (
    <div style={{width:'100%',height:"100%",display:'flex',justifyContent:"center",alignItems:"center",flexDirection:"column",gap:'20px'}}>
      <Typography variant='h5'>Something went wronge Please relaod the page</Typography>
      <CustomButton buttonText={"Reload"} onClick={()=>Navigate("/")} />
    </div>
  )
}

export default DoctorCalender;