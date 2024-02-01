import React from 'react'
import SwipeableViews from "react-swipeable-views";
import { useState } from 'react'
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';
import TarrifWithService from '../TarrifWithService/TarrifWithService';
import TarrifMaster from '../TarrifMaster/TarrifMaster';

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

function MainTarrif() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
const handleChangeIndex = (index) => {
  setValue(index);
};  

const handleChange = (event, newValue) => {
  setValue(newValue);
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

return (
    <Box style={{padding:"0px"}}>
    <AppBar position="static" color="default" style={{width:'97%',margin:"0 auto"}}>
    <Tabs
      value={value}
      onChange={handleChange}
      indicatorColor="primary"  // Set the underline color to the primary color
      textColor="#6c757d"
      variant="fullWidth"
    >
      <Tab label="Tarrif Master With Service" {...a11yProps(0)} style={{fontWeight:"bold",color: value!==0 ? "#6c757d" : "rgb(37,57,111)"}}/>
      <Tab label="Tarrif Master" {...a11yProps(2)} style={{fontWeight:"bold",color: value!==2 ? "#6c757d" : "rgb(37,57,111)"}}/>
    </Tabs>
    </AppBar> 
    <SwipeableViews
    style={{padding:"0px"}}
    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
    index={value}
    onChangeIndex={handleChangeIndex}
    >
    <TabPanel  value={value} index={0} dir={theme.direction}>
    <TarrifWithService/>
    </TabPanel>
    <TabPanel value={value} index={1} dir={theme.direction}>
    <TarrifMaster />
    </TabPanel>
    </SwipeableViews> 
    </Box>
    )
}

export default MainTarrif