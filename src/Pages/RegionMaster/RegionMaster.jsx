import React from 'react'
import SwipeableViews from "react-swipeable-views";
import { memo, useState } from 'react'
import CityMaster from '../CityMaster/CityMaster';
import StateMaster from '../StateMaster/StateMaster';
import CountryMaster from '../CountryMaster/CountryMaster';
import { AppBar, Box, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';


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




function RegionMaster() {
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
    <Box>
      <AppBar position="static" color="default" style={{width:'97%',margin:"0 auto"}}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"  // Set the underline color to the primary color
        textColor="#6c757d"
        variant="fullWidth"
      >
        <Tab label="City" {...a11yProps(0)} style={{fontWeight:"bold",color: value!==0 ? "#6c757d" : "rgb(37,57,111)"}}/>
        <Tab label="State" {...a11yProps(1)} style={{fontWeight:"bold",color: value!==1 ? "#6c757d" : "rgb(37,57,111)"}}/>
        <Tab label="Country" {...a11yProps(2)} style={{fontWeight:"bold",color: value!==2 ? "#6c757d" : "rgb(37,57,111)"}}/>
      </Tabs>
    </AppBar>
    <SwipeableViews
    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
    index={value}
    onChangeIndex={handleChangeIndex}
  >
    <TabPanel value={value} index={0} dir={theme.direction}>
      <CityMaster />
    </TabPanel>
    <TabPanel value={value} index={1} dir={theme.direction}>
     <StateMaster />
    </TabPanel>
    <TabPanel value={value} index={2} dir={theme.direction}>
      <CountryMaster />
    </TabPanel>
  </SwipeableViews>
    </Box>
  )
}

export default RegionMaster