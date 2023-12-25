import React, { useEffect, useState } from 'react'
import { socket } from '../../../socket';
import { useDispatch,useSelector } from 'react-redux';
import { setSocketConnected } from '../../../slices/socket.slice';
import { setDoctorCalenderEditData, setDoctorCalenderLoading, setRemainingDays, setSeveDayData } from '../../../slices/doctorCalender.slice';
import BoxCalsses from "./handleStepOne.module.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CustomAddIcons from '../../../Components/CustomeIcons/CustomAddIcons';
import { useForm,Controller } from 'react-hook-form';
import AddEditModal from '../../../Components/AddEditModal/AddEditModal';
import { Box,Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { CustomTextInputField } from '../../../Components/InputsFilelds/CustomTextInputField';
import { useDoctorMasterData } from '../../../services/DoctorCalender/DoctorMaster';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import toast from "react-hot-toast"
import { Numbers } from '@mui/icons-material';

function RenderBox({day,date,index,leftTime,startTime,sessionTime,doBreak}) {
    const [MenuItemControl, setMenuItemControl] = useState(null);
    const dispatch = useDispatch(); 
    const handleClose = () =>{ 
        setMenuItemControl(null);
    }


    return (<div className={BoxCalsses.RenderBox} >
        <div className={BoxCalsses.BoxHeading}>
            <span>{day}</span>
            <span className={BoxCalsses.date}> <AccessTimeIcon style={{fontSize:'20px'}}/> {date} 
                <IconButton 
                    onClick={(e)=>setMenuItemControl(e.currentTarget)} 
                    aria-controls={MenuItemControl ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={MenuItemControl ? 'true' : undefined}
                >
                    <MoreVertIcon/>
                </IconButton> 
            </span>
            <Menu
            anchorEl={MenuItemControl}
            open={Boolean(MenuItemControl)}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
            >
            <MenuItem onClick={()=>{doBreak(index);handleClose();}}>Holiday</MenuItem>
            <MenuItem onClick={()=>{dispatch(setDoctorCalenderEditData(index));handleClose()}}>Edit</MenuItem>
            </Menu>
        </div>
        <Divider style={{margin:'5px 0px'}}/>
        <div className={BoxCalsses.obj}>
            <span className={BoxCalsses.title}>StartTime</span> : {startTime}
        </div>
        <div className={BoxCalsses.obj}>
             <span className={BoxCalsses.title}>leftTime</span> : {leftTime}
        </div>
        <div className={BoxCalsses.obj}>
            <span className={BoxCalsses.title }>SessionTime</span>: {sessionTime}
        </div>
        <Divider style={{margin:'5px 0px'}}/>
        <div className={BoxCalsses.flexEnd}>
            <Button variant="text" style={{color:"#25396f",alignSelf:"end"}}  size='small' > Show Slots</Button>
        </div>
            </div>)
}

function DoctorSlotsByDate() {
    const dispatch = useDispatch(); 
    const { doctor,sevenDayData,loading,remainingDays,doctorCalenderEditData,doctorCalenderLoading } = useSelector(state => state.doctorCalender);
    const [createTimingModal, setCreateTimingModal] = useState(false);
    const { createDoctorSlotData,updateDoctorSlotData,BreakDoctorSlotData }  = useDoctorMasterData();

    useEffect(()=>{
        console.log('creatTimingModal',createTimingModal);
    },[createTimingModal])

    function getRoomId() {
        let temp = `${new Date().toISOString().slice(0, 10).toString()}${doctor?._id?.toString()}`;
        return temp; 
    }
    console.log("this si sevem days data : ",sevenDayData);
    let roomId = getRoomId();

    useEffect(() => {
        function onConnect() {
            console.log('socket is connected')
            dispatch(setSocketConnected(true));
            socket.emit("joinRoom",roomId,"doctor");
        }
    
        function onDisconnect() {
            console.log("socket disconnedted")
            dispatch(setSocketConnected(false));
        }
    
        function connect() {
            console.log("this function run ",)
          socket.connect();
        }

        function disconnect() {
         socket.emit("leaveRoom",roomId);
          socket.disconnect();
        }
    
        connect();
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('doctorCalenderData', (data)=>{
            dispatch(setDoctorCalenderLoading(true))
            console.log("this is data from socket yeyeyeyyeye: ",data);
           if(data){
            const currentDate = new Date();
            const tempData = data.commonSchedule.map((obj,index)=>({...obj,date:new Date(new Date(currentDate).setDate(currentDate.getDate() + index)).toISOString().slice(0, 10)}))
            data.commonSchedule = tempData;
            dispatch(setSeveDayData(data));
            const DayData = [ 
                { name: 'mon', index: 0 },
                { name: 'tue', index: 1 },
                { name: 'wed', index: 2 },
                { name: 'thu', index: 3 },
                { name: 'fri', index: 4 },
                { name: 'sat', index: 5 },
                { name: 'sun', index: 6 }
              ]

                        // Extract the indices from tempData
            const indicesToRemove = data?.commonSchedule?.map(item => item.index);

            // Filter DayData to remove elements with matching indices
            const updatedDayData = DayData.filter(item => !indicesToRemove.includes(item.index));

            dispatch(setRemainingDays(updatedDayData));
            dispatch(setDoctorCalenderLoading(false)); 
           } else {
            toast.error("Something went wronge in socket");
           }
        });

       
        return () => {
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
          socket.off('doctorCalenderData');
          disconnect();
          console.log('component is unmounted')
        };
      }, []);

      var { handleSubmit, formState: { errors },reset,control,clearErrors,watch } = useForm({
        defaultValues: {
          day: null,
          startTime:null,
          leftTime:null,
          sessionTime:null,
        },
        mode:'onTouched'
      });

      const watchStarttime = watch("startTime"); 

      function StringToCorrectDate(dateString) {
        if(dateString)
        {
            const [hours, minutes] = dateString.split(':');
            return dayjs().set('hour', parseInt(hours, 10)).set('minute', parseInt(minutes, 10))
        } 
        return null;
      }


      useEffect(()=>{
        console.log('this is doctorEditData',doctorCalenderEditData);
        if((doctorCalenderEditData || doctorCalenderEditData==0)&& Number.isInteger(doctorCalenderEditData))
        {
            const tempData = sevenDayData?.commonSchedule?.[doctorCalenderEditData];
            console.log('tempData',tempData);

            const newData = {...tempData?.doctorTime,startTime:StringToCorrectDate(tempData?.doctorTime?.startTime),leftTime:StringToCorrectDate(tempData?.doctorTime?.leftTime)};

            reset({...newData});
            setCreateTimingModal(true);
            // console.log("newData",newData);

        }
      },[doctorCalenderEditData])

   
      const closeTheModal = () => {
          setCreateTimingModal(false);
            dispatch(setDoctorCalenderEditData(null))
          reset({
            day: null,
            startTime:null,
            leftTime:null,
            sessionTime:null,
           });
        clearErrors();
      }

        const submitData = async(data) => {
            const compareWith = sevenDayData?.commonSchedule?.[doctorCalenderEditData]?.doctorTime
            let tempData ={}
            console.log(`${data.startTime.$H}:${data.startTime.$m}`!= compareWith.startTime);
            if(`${data.startTime.$H}:${data.startTime.$m}`!= compareWith.startTime)
            {
                tempData.startTime=`${data.startTime.$H}:${data.startTime.$m}`
            }
             if (`${data.leftTime.$H}:${data.leftTime.$m}`!= compareWith.leftTime)
            {
                tempData.leftTime=`${data.leftTime.$H}:${data.leftTime.$m}`
            }  if (data.sessionTime!=compareWith.sessionTime)
            {
                tempData.sessionTime = data.sessionTime;
            } 
             tempData = {
                ...tempData,
                userId:doctor?._id,
            }   

            if(doctorCalenderEditData || doctorCalenderEditData==0)
            {
                console.log('we are some paty')
               delete tempData.day;
               tempData['_id'] = data._id;
               const resData = await updateDoctorSlotData(tempData); 

               if(resData)
               {
                    closeTheModal();
               }
               return;
            }

            const resData = await createDoctorSlotData(tempData)

            if(resData)
            {
                closeTheModal();
            }            

        }

        const doBreak = (data) => {
            BreakDoctorSlotData({date:sevenDayData?.commonSchedule?.[data]?.date,userId:doctor?._id});
        }


  return (

        <>
       {  <AddEditModal
        maxWidth="lg"
        handleClose={closeTheModal}
        handleSubmit={handleSubmit(submitData)}
        open={createTimingModal}
        modalTitle={doctorCalenderEditData || doctorCalenderEditData==0 ? `Update Doctor Calender` : `Add Doctor Calender`}
        isEdit={doctorCalenderEditData || doctorCalenderEditData==0}
        Loading={doctorCalenderLoading}
        >
        <Box
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
                    <Grid xs={12} sm={4}>
                    <Controller
                        name="startTime"
                        control={control}
                        rules={{ required: { valueAsDate:true,value: true, message: 'StartTime is required' } }}
                        render={({ field, fieldState: { error } }) => {
                            const { onChange, value, ref, onBlur } = field;
                            return (
                            <>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                     sx={{  "& label.Mui-focused": {
                                        color: error ? "#d32f2f" : "#25396f"
                                      }, "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                          borderColor: error ? "#d32f2f" : "#25396f"
                                        }
                                      }}}
                                    onChange={onChange}
                                    value={value}
                                    ref={ref}
                                    label="Select StartTime"
                                    views={['hours', 'minutes']}
                                    format="hh:mm"
                                    ampm={false}
                                />
                                </LocalizationProvider>
                                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
                            </>
                            );
                        }}
                        />

                    </Grid>


                    <Grid xs={12} sm={4}>
                    <Controller
                        name="leftTime"
                        control={control}
                        rules={{ required: { value: true, message: 'EndTime is required' } }}
                        render={({ field, fieldState: { error } }) => {
                            const { onChange, value, ref, onBlur } = field;
                            return (
                            <>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                            
                                    sx={{
                                        "& label.Mui-focused": {
                                          color: error ? "#d32f2f" : "#25396f",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                          "&.Mui-focused fieldset": {
                                            borderColor: error ? "#d32f2f" : "#25396f",
                                          },
                                        },
                                      }}
                                    onChange={onChange}
                                    value={value}
                                    minTime={watchStarttime}
                                    ref={ref}
                                    label="Select EndTime"
                                    views={['hours', 'minutes']}
                                    format="hh:mm"
                                    ampm={false}
                                    ampmInClock={false}
                                />
                                </LocalizationProvider>
                                {error && <Typography variant="caption" color="error">{error.message}</Typography>}
                            </>
                            );
                        }}
                        />

                    </Grid>

                    <Grid xs={12} sm={4}>
                     <CustomTextInputField 
                        type="number"
                        name={"sessionTime"}
                        control={control}
                        label={"Session Time"}
                        rules={{valueAsNumber:true,required:{value:true,message:"session time is required"}}}
                        />
                    </Grid>

                  { !(doctorCalenderEditData || doctorCalenderEditData==0) && <Grid xs={12} sm={4}>
                        <Controller
                        name="day"
                        control={control}
                        rules={{ required: 'day is required' }}
                        render={({ field,fieldState: { error } }) => {
                        const {onChange,value,ref,onBlur} = field; 
                        return <CustomAutoCompelete 
                        onChange={onChange}
                        lable={"Select day"}
                        hasError={error}
                        value={value}
                        onBlur={onBlur}
                        inputRef={ref}
                        options={remainingDays}
                        getOptionLabel={(option)=> option.name }

                        /> 
                    }}
                        />
                        {
                        errors.day && <Typography variant="caption" color="error">Day is required</Typography> 
                        }
                    </Grid>}
                </Grid>
        </Box>

        </AddEditModal>}
    <div>
        { <div className={BoxCalsses.slotsContainer}>
                {
                    remainingDays?.length > 0 && <div className={BoxCalsses.createSlots} onClick={()=>setCreateTimingModal(true )}>
                    <Button variant="text"  size='small' startIcon={<CustomAddIcons/>} > Add Timing Of WeekDays</Button>
                    </div>
                }
            {
                Array.isArray(sevenDayData?.commonSchedule) && sevenDayData?.commonSchedule?.map((item,index) => {
                    return <RenderBox key={index} doBreak={doBreak} index={index} day={item?.dayName} date={item?.date} leftTime={item?.doctorTime?.leftTime} startTime={item?.doctorTime?.startTime} sessionTime={item?.doctorTime?.sessionTime} />
                })
            }
            </div>
        }

      

    </div>
    </>
  )
}

export default DoctorSlotsByDate