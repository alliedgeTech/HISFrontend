import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Tab, Tabs, AppBar } from "@mui/material";
import { useTheme } from '@emotion/react';
import SwipeableViews from "react-swipeable-views";
import { useSecretoryAppointmentData } from '../../services/Consultant Dashboard/secretoryAppointment';
import { setSecretoryAppointmentCurrentSocketRooms, setSecretoryAppointmentStep } from '../../slices/secretoryappointment.slice';
import SecretoryAppointment from './SecretoryAppointment';

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
    const { secretoryAppointmentStep,secretoryStartDate,secretoryEndDate } = useSelector(state=>state.secretoryAppointment);

    const { getAppointmentData } = useSecretoryAppointmentData();
    const theme = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        getAppointmentData(true);
        console.log("!@# step 1 : useEffect run : ",secretoryStartDate,secretoryEndDate)
        dispatch(setSecretoryAppointmentCurrentSocketRooms({startDate:secretoryStartDate,endDate:secretoryEndDate}))
      return () => {
        dispatch(setSecretoryAppointmentCurrentSocketRooms());
      }
    },[])

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
            value={secretoryAppointmentStep}
            onChange={handleChange}
            indicatorColor="primary"  // Set the underline color to the primary color
            textColor="#6c757d"
            variant="fullWidth"
          >
            <Tab label="all appointments" {...a11yProps(0)} style={{fontWeight:"bold",color: secretoryAppointmentStep!==0 ? "#6c757d" : "rgb(37,57,111)"}}/>
            <Tab label="Token generated appointments " {...a11yProps(1)} style={{fontWeight:"bold",color: secretoryAppointmentStep!==1 ? "#6c757d" : "rgb(37,57,111)"}}/>
            <Tab label="compeleted appointments" {...a11yProps(2)} style={{fontWeight:"bold",color: secretoryAppointmentStep!==2 ? "#6c757d" : "rgb(37,57,111)"}}/>
          </Tabs>
        </AppBar>
        <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={secretoryAppointmentStep}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={secretoryAppointmentStep} index={0} dir={theme.direction}>
          <SecretoryAppointment />
        </TabPanel>
      </SwipeableViews>
        </Box>
      )
}

export default MainSecretoryAppointment