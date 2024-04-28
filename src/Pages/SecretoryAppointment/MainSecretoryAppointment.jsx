import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import HandleStepOneClasses from "../DoctorCalender/components/handleStepOne.module.css";
import { Typography, Box, Grid, Tab, Tabs, AppBar } from "@mui/material";
import { useAppointmentData } from '../../services/Consultant Dashboard/Appointment';
import CustomButton from '../../Components/Button/Button';
import { useForm,Controller } from 'react-hook-form';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import { useTheme } from '@emotion/react';
import SwipeableViews from "react-swipeable-views";
import { useDeferredValue } from 'react';
import SecretoryAppointment from './SecretoryAppointment';
import { setSecretoryAppointmentBranch, setSecretoryAppointmentCurrentSocketRooms, setSecretoryAppointmentStep, setSecretoryShowDoctorAppointment } from '../../slices/secretoryAppointment.slice';
import SecretoryAppointmentSwiper2 from './components/SecretoryAppointmentSwiper2';
import SecretoryAppointmentSwiper3 from './components/SecretoryAppointmentSwiper3';


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

function MainSecretoryAppointment() {
    const { appointmentStep,startDate,endDate,branch } = useSelector(state=>state.secretoryAppointment);
    const { getSecretoryAppintmentData } = useAppointmentData();
    const theme = useTheme();
    const dispatch = useDispatch();
    const {  handleSubmit,control,watch } = useForm({
        defaultValues:{
            'doctorAppointmentList':null,
            branch:null,
        },
        mode:"onTouched"
    });
    const doctorwatch = watch('doctorAppointmentList');
    const doctorDefferedValue = useDeferredValue(doctorwatch);



    useEffect(() => {
      return () => {
        dispatch(setSecretoryAppointmentCurrentSocketRooms(undefined));
      }
    },[])

    function setDoctorAppointmentListDoctor(data) {
        dispatch(setSecretoryShowDoctorAppointment(data?.doctorAppointmentList));
        dispatch(setSecretoryAppointmentBranch(data?.branch))
        getSecretoryAppintmentData(
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          data?.doctorAppointmentList,
          undefined,
          data.branch
        );
        dispatch(setSecretoryAppointmentCurrentSocketRooms({startDate,endDate,doctorId:data.doctorAppointmentList?._id,branch:data.branch._id}));
      }

    if (!branch) {
        return (
          <div className={HandleStepOneClasses.container}>
            <div className={HandleStepOneClasses.Box}>
              <Typography className={HandleStepOneClasses.cusTypogrphy}>
                Select Doctor & Branch
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
                  justifyContent="space-evenly"
                  alignItems="center">
                  <Grid sm={4}>
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

                  <Grid sm={4}>
                    <Controller
                      name="branch"
                      rules={{ required: "Branch is required" }}
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref, onBlur } = field;
                        return (
                          <CustomAutoCompelete
                            onChange={onChange}
                            lable={"Select Branch"}
                            value={value}
                            onBlur={onBlur}
                            getOptionLabel={(option)=> option.location}
                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                            filterOnActive={true}
                            url={ doctorDefferedValue ? `admin/locationMaster/location/doctor/${doctorDefferedValue?._id}` : `admin/locationMaster/getlocation`}
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
        dispatch(setSecretoryAppointmentStep(index));
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
      <SecretoryAppointment />
    </TabPanel>
    <TabPanel value={appointmentStep} index={1} dir={theme.direction}>
     <SecretoryAppointmentSwiper2 />
    </TabPanel>
    <TabPanel value={appointmentStep} index={2} dir={theme.direction}>
      <SecretoryAppointmentSwiper3 />
    </TabPanel>
  </SwipeableViews>
    </Box>
  )
}

export default MainSecretoryAppointment;