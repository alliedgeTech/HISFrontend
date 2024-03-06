import React, { useEffect } from 'react'
import Appointment from './Appointment';
import { useDispatch, useSelector } from "react-redux";
import HandleStepOneClasses from "../DoctorCalender/components/handleStepOne.module.css";
import { Typography, Box, Grid, Tab, Tabs, AppBar } from "@mui/material";
import { useAppointmentData } from '../../services/Consultant Dashboard/Appointment';
import { setAppointmentStep, setShowDoctorAppointment } from '../../slices/appointment.slice';
import CustomButton from '../../Components/Button/Button';
import { useForm,Controller } from 'react-hook-form';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import AppointmentSwiper2 from './components/AppointmentSwiper2';
import AppointmentSwiper3 from './components/AppointmentSwiper3';
import { useTheme } from '@emotion/react';
import SwipeableViews from "react-swipeable-views";


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3,paddingBottom:"0px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function MainAppointment() {
    const { appointmentStep,doctorAppointmentList } = useSelector(state=>state.appointment);
    const { getAppintmentData } = useAppointmentData();
    const theme = useTheme();
    const dispatch = useDispatch();
    const {  handleSubmit,control,} = useForm({
        defaultValues:{
            'doctorAppointmentList':null
        },
        mode:"onTouched"
    })

    function setDoctorAppointmentListDoctor(data) {
        console.log("this is selected doctor ", data);
        dispatch(setShowDoctorAppointment(data.doctorAppointmentList));
        getAppintmentData(
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          data.doctorAppointmentList
        );
      }

    if (!doctorAppointmentList) {
        return (
          <div className={HandleStepOneClasses.container}>
            <div className={HandleStepOneClasses.Box}>
              <Typography className={HandleStepOneClasses.cusTypogrphy}>
                Select Doctor
              </Typography> 
              <Box
                width={"100%"}
                component="form"
                onSubmit={handleSubmit(setDoctorAppointmentListDoctor)}
                p={1}>
                <Grid
                  container
                  width={"100%"}
                  // columns={{ xs: 4, sm: 8, md: 12 }}
                  justifyContent="center"
                  alignItems="center">
                  <Grid sm={12}>
                    <Controller
                      name="doctorAppointmentList"
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref } = field;
                        return (
                          <CustomAutoCompelete
                            onChange={onChange}
                            lable={"Select Doctor"}
                            value={value}
                            getOptionLabel={(option) =>
                              ` ${option?.userName} / ${option?.speciality?.speciality}`
                            }
                            url={`admin/userMaster/user/doctor`}
                            inputRef={ref}
                            hasError={error}
                          />
                        );
                      }}></Controller>
                  </Grid>
                </Grid>
                <div className={HandleStepOneClasses.btnContainer}>
                  <CustomButton buttonText={"Next"} type={"submit"} />
                </div>
              </Box>
            </div>
          </div>
        );
      }
      
      const handleChangeIndex = (index) => {
        dispatch(setAppointmentStep(index));
      };  

      const handleChange = (event, newValue) => {
        handleChangeIndex(newValue);
      };

      function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          "aria-controls": `full-width-tabpanel-${index}`
        };
      }

  return (
    <Box>
      <AppBar position="static" color="default" style={{width:'97%',margin:"0 auto"}}>
      <Tabs
        value={appointmentStep}
        onChange={handleChange}
        indicatorColor="primary"  // Set the underline color to the primary color
        textColor="#6c757d"
        variant="fullWidth"
      >
        <Tab label="all appointments" {...a11yProps(0)} style={{fontWeight:"bold",color: appointmentStep!==0 ? "#6c757d" : "rgb(37,57,111)"}}/>
        <Tab label="Token generated appointments " {...a11yProps(1)} style={{fontWeight:"bold",color: appointmentStep!==1 ? "#6c757d" : "rgb(37,57,111)"}}/>
        <Tab label="compeleted appointments" {...a11yProps(2)} style={{fontWeight:"bold",color: appointmentStep!==2 ? "#6c757d" : "rgb(37,57,111)"}}/>
      </Tabs>
    </AppBar>
    <SwipeableViews
    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
    index={appointmentStep}
    onChangeIndex={handleChangeIndex}
  >
    <TabPanel value={appointmentStep} index={0} dir={theme.direction}>
      <Appointment />
    </TabPanel>
    <TabPanel value={appointmentStep} index={1} dir={theme.direction}>
     <AppointmentSwiper2 />
    </TabPanel>
    <TabPanel value={appointmentStep} index={2} dir={theme.direction}>
      <AppointmentSwiper3 />
    </TabPanel>
  </SwipeableViews>
    </Box>
  )
}

export default MainAppointment