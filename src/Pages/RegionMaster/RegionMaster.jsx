import React from 'react'
import SwipeableViews from "react-swipeable-views";
import { memo, useEffect, useMemo, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Dialog,DialogContent,DialogTitle,Button } from "@mui/material"
import { useRegionData } from '../../services/Add Master/Regionmaster';


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
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function RegionMaster() {

    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({});

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [CityModal, setCityModal] = useState(false);
    const [StateModal, setStateModal] = useState(false);
    const [ContryModal, setCountryModal] = useState(false);
    const [CustomErros, setCustomErros] = useState({});

    const dispatch = useDispatch();

    function resetAllfields(){
    reset({
        cityName:null,
        stateName:null,
        countryName:null,
        isActive: "",
    })
    }

      const handleChangeIndex = (index) => {
        resetAllfields();
        setValue(index);
      };

      function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          "aria-controls": `full-width-tabpanel-${index}`
        };
      }


   
    

  return (
    <div>

    </div>
  )
}

export default RegionMaster