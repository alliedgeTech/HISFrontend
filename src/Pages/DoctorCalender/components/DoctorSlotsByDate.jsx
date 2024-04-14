import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocketConnected } from "../../../slices/socket.slice";
import {
  setActiveDaySlotIndex,
  setActiveDaySlots,
  setActiveDaySlotsUpdate,
  setAddedNewSlots,
  setDoctorCalenderEditData,
  setDoctorCalenderLoading,
  setLeveRoomDate,
  setRemainingDays,
  setRemoveSlots,
  setSeveDayData,
} from "../../../slices/doctorCalender.slice";
import BoxCalsses from "./handleStepOne.module.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CustomAddIcons from "../../../Components/CustomeIcons/CustomAddIcons";
import { useForm, Controller } from "react-hook-form";
import AddEditModal from "../../../Components/AddEditModal/AddEditModal";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import CustomAutoCompelete from "../../../Components/CustomAutoCompelete/CustomAutoCompelete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { CustomTextInputField } from "../../../Components/InputsFilelds/CustomTextInputField";
import { useDoctorMasterData } from "../../../services/DoctorCalender/DoctorMaster";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import socket from "../../../socket";
import CustomButton from "../../../Components/Button/Button";
import CustomIconButton from "../../../Components/CustomeIcons/CustomEditIcons";


const dataColorSow = [
  {
    color: "#25396f",
    label: "Booked",
  },
  {
    color: "#ef5350",
    label: "Break",
  },
  {
    color: "#4caf50",
    label: "Remaning",
  },
];

const ColorRender = ({ color, label }) => {
  return (
    <div className={BoxCalsses.text_icon_align + " " + BoxCalsses.colorWidth}>
      <div style={{ background: color }} className={BoxCalsses.ColorShow}></div>
      <div className={BoxCalsses.ColorLebal}>{label}</div>
    </div>
  );
};

function RenderBox({
  day,
  date,
  index,
  scheduleData,
  doBreak,
  HandleSlotDataIndex,
}) {
  const [MenuItemControl, setMenuItemControl] = useState(null);
  const dispatch = useDispatch();
  const handleClose = () => {
    setMenuItemControl(null);
  };
  const { activeDaySlotIndex } = useSelector((state) => state.doctorCalender);
  return (
    <div className={BoxCalsses.RenderBox} style={{ background: activeDaySlotIndex === index ? "rgb(37, 57, 111)" : "white",color: activeDaySlotIndex === index ? 'white' : 'black' }}>
      <div className={BoxCalsses.BoxHeading}>
        <span>{day}</span>
        <span className={BoxCalsses.date}>
          {" "}
          <AccessTimeIcon style={{ fontSize: "20px" }} /> {date}
          <IconButton
            onClick={(e) => setMenuItemControl(e.currentTarget)}
            aria-controls={MenuItemControl ? "basic-menu" : undefined}
            aria-haspopup="true"
            style={{color: activeDaySlotIndex === index ? 'white' : 'black' }}
            aria-expanded={MenuItemControl ? "true" : undefined}>
            <MoreVertIcon />
          </IconButton>
        </span>
        <Menu
          anchorEl={MenuItemControl}
          open={Boolean(MenuItemControl)}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}>
          <MenuItem
            onClick={() => {
              doBreak(index);
              handleClose();
            }}>
            Holiday
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch(setDoctorCalenderEditData(index));
              handleClose();
            }}>
            Edit
          </MenuItem>
        </Menu>
      </div>
      <Divider style={{ margin: "5px 0px" }} />
      <table >
        <thead>
          <th>Branch</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Session Duration</th>
        </thead>
        <tbody>
            {
              scheduleData?.map((item,index) => (
                <tr key={index} > 
                  <td>{item.branch.location}</td>
                  <td style={{textAlign:'center'}}>{item.startTime}</td>
                  <td style={{textAlign:'center'}}>{item.endTime}</td>
                  <td style={{textAlign:'center'}}>{item.sessionDuration}</td>
                </tr>
              ))
            }
        </tbody>
      </table>
      {/* <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>StartTime</span> : {startTime}
      </div>
      <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>endTime</span> : {endTime}
      </div>
      <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>SessionTime</span>: {sessionTime}
      </div> */}
      <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",height:"fit-content"}}> 
      <Divider style={{ margin: "5px 0px" }} />
      <div className={BoxCalsses.flexEnd}>
        <Button
          variant="text"
          disabled={activeDaySlotIndex === index}
          onClick={() => HandleSlotDataIndex(index)}
          style={{
            color: activeDaySlotIndex !== index ? "#25396f" : "white",
            alignSelf: "end",
          }}
          size="small">
          {" "}
          Show Slots
        </Button>
      </div>
      </div>
    </div>
  );
}

function BreakSlot({ time, TakeIndivisualBreak, _id }) {
  const [MenuItemControl, setMenuItemControl] = useState(null);
  function handleClose() {
    setMenuItemControl(null);
  }
  return (
    <div
      className={BoxCalsses.slot}
      style={{ background: dataColorSow[1].color }}>
      {time}
      <IconButton
        onClick={(e) => setMenuItemControl(e.currentTarget)}
        aria-controls={MenuItemControl ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={MenuItemControl ? "true" : undefined}
        style={{
          position: "absolute",
          top: "-4px",
          right: "-8px",
          color: "white",
        }}>
        <MoreVertIcon style={{ fontSize: "20px" }} />
      </IconButton>
      <Menu
        anchorEl={MenuItemControl}
        open={Boolean(MenuItemControl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem
          onClick={() => {
            TakeIndivisualBreak({ _id, boolBreak: false });
            handleClose();
          }}>
          Cancle Break
        </MenuItem>
      </Menu>
    </div>
  );
}

function BookedSlot({ time, count, TakeIndivisualBreak, _id }) {
  const [MenuItemControl, setMenuItemControl] = useState(null);
  function handleClose() {
    setMenuItemControl(null);
  }
  return (
    <div
      className={BoxCalsses.slot}
      style={{ background: dataColorSow[0].color }}>
      <span>{time}</span>
      <span className={BoxCalsses.count}>{count}</span>
      <IconButton
        onClick={(e) => setMenuItemControl(e.currentTarget)}
        aria-controls={MenuItemControl ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={MenuItemControl ? "true" : undefined}
        style={{
          position: "absolute",
          top: "-4px",
          right: "-8px",
          color: "white",
        }}>
        <MoreVertIcon style={{ fontSize: "20px" }} />
      </IconButton>
      <Menu
        anchorEl={MenuItemControl}
        open={Boolean(MenuItemControl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem
          onClick={() => {
            TakeIndivisualBreak({ _id, boolBreak: true });
            handleClose();
          }}>
          Take Break
        </MenuItem>
      </Menu>
    </div>
  );
}

function SlotSBoxRender({
  booked,
  slotBreak,
  startTime,
  count,
  TakeIndivisualBreak,
  _id,
  ...props
}) {
  const [MenuItemControl, setMenuItemControl] = useState(null);

  function handleClose() {
    setMenuItemControl(false);
  }

  if (slotBreak) {
    return (
      <BreakSlot
        _id={_id}
        time={startTime}
        TakeIndivisualBreak={TakeIndivisualBreak}
      />
    );
  }

  if (booked) {
    return (
      <BookedSlot
        time={startTime}
        _id={_id}
        count={count}
        TakeIndivisualBreak={TakeIndivisualBreak}
      />
    );
  }
  return (
    <div
      className={BoxCalsses.slot}
      style={{ background: dataColorSow[2].color }}>
      <span>{startTime}</span>
      {/* <button
        onClick={() =>
          TakeIndivisualBreak({
            booked,
            break: slotBreak,
            startTime,
            count,
            ...props,

          })
        }>
        Take Break
      </button> */}
      <IconButton
        onClick={(e) => setMenuItemControl(e.currentTarget)}
        aria-controls={MenuItemControl ? "basic-menu" : undefined}
        aria-haspopup="true"
        style={{
          position: "absolute",
          top: "-4px",
          right: "-8px",
          color: "white",
        }}
        aria-expanded={MenuItemControl ? "true" : undefined}>
        <MoreVertIcon style={{ fontSize: "20px" }} />
      </IconButton>

      <Menu
        anchorEl={MenuItemControl}
        open={Boolean(MenuItemControl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem
          onClick={() => {
            TakeIndivisualBreak({ _id, boolBreak: true });
            handleClose();
          }}>
          Take Break
        </MenuItem>
      </Menu>
    </div>
  );
}

function DoctorSlotsByDate() {
const dispatch = useDispatch();
    const {
        doctor,
        location,
        sevenDayData,
        loading,
        remainingDays,
        doctorCalenderEditData,
        doctorCalenderLoading,
        activeDaySlots,
        activeDaySlotIndex,
        leaveRoomDate,
    } = useSelector((state) => state.doctorCalender);

  const [createTimingModal, setCreateTimingModal] = useState(false);

  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
    watch,
    getValues,
    setValue
  } = useForm({
    defaultValues: {
      day: null,
      schedule: [{ branch: null, startTime: null, endTime: null,sessionDuration:null }],
    },
    mode: "onTouched",
  });

  const watchSchedule = watch("schedule");

  const { getDoctorCalenderData, createDoctorSlotData, updateDoctorSlotData, BreakDoctorSlotData } =
    useDoctorMasterData();

    let mouseDown = false;
    let startX, scrollLeft;
    const parentRef = useRef(null);
  
    const startDragging = (e) => {
      mouseDown = true;
      startX = e.pageX - parentRef.current.offsetLeft;
      scrollLeft = parentRef.current.scrollLeft;
    }
    
    useEffect(() => {
      console.log('this is active day slots : ',activeDaySlots);
    },[activeDaySlots ])

    const stopDragging = (e) => {
      mouseDown = false;
    }
    
    const move = (e) => {
      e.preventDefault();
      if(!mouseDown) { return; }
      const x = e.pageX - parentRef.current.offsetLeft;
      const scroll = x - startX;
      parentRef.current.scrollLeft = scrollLeft - scroll;
    }

    function getRoomId(date) {
        let temp = `${doctor?._id?.toString()}_${
          date
            ? new Date(date).toLocaleDateString("en-CA").toString()
            : new Date().toLocaleDateString("en-CA").toString()
        }_${location?._id?.toString()}`;
    
        if (temp === "Invalid Date") {
          temp = location?._id?.toString() +'_'+ new Date().toLocaleDateString("en-CA").toString() + '_'+ doctor?._id?.toString();
        }
    
        return temp;
      }
    
      function addTimingInSchdule(){
        const schedule = getValues("schedule");
        let obj = { branch: null, startTime: null, endTime: null,sessionDuration:null };
        if(Number.isInteger(doctorCalenderEditData)) {
          obj.new = true;
        }
        setValue("schedule", [...schedule, obj]);
      }

      function removeSchedule(index){
        const schedule = getValues("schedule");
        if(schedule.length === 1) return toast.error("You can't remove all the schedule"); 
        const temp = schedule.filter((obj,ind) => ind !== index);
        setValue("schedule",temp);
      }

      function joinRoomAndGetSlots(roomId){
        socket.emit("joinRoom", [roomId]);
        socket.emit("slots", { type: "get", id:roomId}, (data)=>{
            if(!data.success){
              return toast.error(data.message);
            }

            dispatch(setActiveDaySlots(data.value));             

        });
        
      }

      useEffect(() => {
   
        dispatch(setLeveRoomDate(new Date().toLocaleDateString("en-CA").toString())
        );

        const roomId = getRoomId();
        joinRoomAndGetSlots(roomId);
    
        // socket.on("doctorCalenderData", (data) => {
        //   dispatch(setDoctorCalenderLoading(true));
        //   console.log("this is data from socket yeyeyeyyeye: ", data);

        //   if (data) {
        //     const currentDate = new Date();
        //     const tempData = data.commonSchedule.map((obj, index) => ({
        //       ...obj,
        //       date: getCurrentWeekDateByDay(obj?.dayName)
        //         .toLocaleDateString("en-CA")
        //         .toString(),
        //     }));
        //     data.commonSchedule = tempData;
        //     dispatch(setSeveDayData(data));
        //     const DayData = [
        //       { name: "mon", index: 0 },
        //       { name: "tue", index: 1 },
        //       { name: "wed", index: 2 },
        //       { name: "thu", index: 3 },
        //       { name: "fri", index: 4 },
        //       { name: "sat", index: 5 },
        //       { name: "sun", index: 6 },
        //     ];
    
        //     // Extract the indices from tempData
        //     const indicesToRemove = data?.commonSchedule?.map((item) => item.index);
    
        //     // Filter DayData to remove elements with matching indices
        //     const updatedDayData = DayData.filter(
        //       (item) => !indicesToRemove.includes(item.index)
        //     );
    
        //     dispatch(setRemainingDays(updatedDayData));
        //     dispatch(setDoctorCalenderLoading(false));
        //   } else {
        //     toast.error("Something went wronge in socket");
        //   }

        // });
    
        //TODO remove this event future
        socket.on("update_slot",(data)=>{
          if(!data) return;
          dispatch(setActiveDaySlotsUpdate(data))
        })
    
        socket.on("slots", (data) => {
          switch(data?.type){
            case 'get':
              //* here we got all slots data
              getDoctorCalenderData();
              dispatch(setActiveDaySlots(data?.data));
              console.log("slotData", data);
              break;
            case 'add':
            //TODO add function for this add the slots
              // uid and data and at place we have to add
              dispatch(setAddedNewSlots(data));
              console.log("please add this slots : ",data);
              break;
    
            case 'delete':
            //TODO : delete the slots
              dispatch(setRemoveSlots(data))
              console.log("please delete this slots : ",data);
              break;
            
            case 'update':
            //TODO : update the slots
              dispatch(setActiveDaySlotsUpdate(data));
              console.log("please update this slots : ",data);
              break;
          }
          
        });
        
        return () => {
          dispatch(setActiveDaySlotIndex(null));
          socket.off("slots");
          socket.off("doctorCalenderData");
          //TODO remove this event future
          socket.off("update_slot");
          socket.emit("leaveRoom",[getRoomId(leaveRoomDate)]);
        };
      }, []);

      function HandleSlotDataIndex(index) {
        console.log("this is index @: ", index);
        if (activeDaySlotIndex === index) {
          console.log(
            "i am emit the event that is joinRoom Date : same date click"
            );
          return;
        }
    
        if (sevenDayData) {
          dispatch(setActiveDaySlotIndex(index));
          socket.emit("leaveRoom", [getRoomId(leaveRoomDate)]);
          const date = sevenDayData?.[index]?.date;
          console.log("i am emit the event that is joinRoom Date : ", date);
          const key = getRoomId(date);
          joinRoomAndGetSlots(key)
          dispatch(setLeveRoomDate(date));
        } else {
          toast.error("Doctor common schedule is not available");
        }
      }

      function StringToCorrectDate(dateString) {
        if (dateString) {
          const [hours, minutes] = dateString.split(":");
          return dayjs()
            .set("hour", parseInt(hours, 10))
            .set("minute", parseInt(minutes, 10));
        }
        return null;
      }

      useEffect(() => {
        //TODO : here we have to see wehen doctorCalenderEditData is change at that time we have to set data in useform
        if (
          (doctorCalenderEditData || doctorCalenderEditData == 0) &&
          Number.isInteger(doctorCalenderEditData)
        ) {
          let tempData = JSON.parse(JSON.stringify(sevenDayData?.[doctorCalenderEditData]));
          
          tempData.schedule = tempData.schedule.map((obj) => (
            {
              ...obj,
              startTime:dayjs(new Date(new Date(`2000-01-01 ${obj.startTime}`))),
              endTime:dayjs(new Date(new Date(`2000-01-01 ${obj.endTime}`)))
            }
          ))
          reset({
            day:null,
            schedule:tempData?.schedule
          })
          // const newData = {
          //   ...tempData?.doctorTime,
          //   date: tempData?.date,
          //   day: { name: tempData?.dayName },
          //   startTime: StringToCorrectDate(tempData?.doctorTime?.startTime),
          //   endTime: StringToCorrectDate(tempData?.doctorTime?.endTime),
          // };
    
          // reset({ ...newData });
          setCreateTimingModal(true);
          console.log("newData",tempData);
        }
      }, [doctorCalenderEditData]);

      const closeTheModal = () => {
        setCreateTimingModal(false);
        dispatch(setDoctorCalenderEditData(null));
        reset({
            day: null,
            schedule: [{ branch: null, startTime: null, endTime: null,sessionDuration:null }],
        });
        clearErrors();
      };

      const submitData = async (data) => {
        //TODO : here we  have to change whole function

        console.log("this is data i got form the form : ",data);
        const day = data.day?.value;
        let schedule = data.schedule.map((obj) => {
          return{
            new: obj.new,
            uid: obj.uid,
            branch: obj.branch?._id,
            startTime: obj.startTime.format('HH:mm'),
            endTime: obj.endTime.format("HH:mm"),
            sessionDuration: obj.sessionDuration,
          }
        })
        console.log("this is data i got form the form : 2",schedule);
        let newSchedule ;
        if(doctorCalenderEditData || doctorCalenderEditData==0){
          newSchedule = schedule.filter((obj) => obj.new);
          schedule = schedule.filter((obj) => !obj.new);
        }

        const obj = {
          doctorId: doctor?._id,
          day,
          schedule:JSON.stringify(schedule),
          _id: sevenDayData?.[doctorCalenderEditData]?._id,
        }

        if(doctorCalenderEditData || doctorCalenderEditData==0){
          console.log("this is schedule : ",obj.schedule,newSchedule);
          const resData = await updateDoctorSlotData({_id:obj._id,schedule:obj.schedule,newSchedule:JSON.stringify(newSchedule)});
          if(resData){
            closeTheModal();
          }
          console.log("editing is going on : ",obj)
        } else {
          const resData = await createDoctorSlotData(obj);
          if(resData){
            closeTheModal();
          }
        }
        // const compareWith =
        //   sevenDayData?.commonSchedule?.[doctorCalenderEditData]?.doctorTime;
        // let tempData = {};
        // console.log("data", data);
        // // console.log("this is start time : ",data.startTime.$H.length < 2 ? 'babu' : "op",data.startTime.$H);
        // console.log(
        //   "this is left time : ",
        //   `${data.leftTime.$H}:${data.leftTime.$m}`,
        //   compareWith?.leftTime
        // );
        // let MakeCombo;
        // MakeCombo = `${SetTwoMinimumLength(
        //   data.startTime.$H
        // )}:${SetTwoMinimumLength(data.startTime.$m)}`;
        // if (MakeCombo != compareWith?.startTime) {
        //   tempData.startTime = MakeCombo;
        //   if (MakeCombo < compareWith?.startTime) {
        //     tempData.startTimeAdditional = {
        //       oldStartTime: compareWith?.startTime,
        //       sessionTime: data.sessionTime,
        //     };
        //   }
        // }
    
        // MakeCombo = `${SetTwoMinimumLength(data.leftTime.$H)}:${SetTwoMinimumLength(
        //   data.leftTime.$m
        // )}`;
        // if (MakeCombo != compareWith?.leftTime) {
        //   tempData.leftTime = MakeCombo;
        //   if (MakeCombo > compareWith?.leftTime) {
        //     tempData.leftTimeAdditional = {
        //       oldleftTime: compareWith?.leftTime,
        //       sessionTime: data.sessionTime,
        //     };
        //   }
        // }
        // if (data.sessionTime != compareWith?.sessionTime) {
        //   tempData.sessionTime = data.sessionTime;
        // }
        // tempData = {
        //   ...tempData,
        //   userId: doctor?._id,
        //   date: data?.date,
        //   day: data?.day?.name,
        // };
    
        // console.log("tempData", tempData);
    
        // if (doctorCalenderEditData || doctorCalenderEditData == 0) {
        //   tempData["_id"] = data._id;
        //   console.log("this is final data : ", tempData);
        //   const resData = await updateDoctorSlotData({
        //     ...tempData,
        //     userId: doctor?._id,
        //   });
    
        //   if (resData) {
        //     closeTheModal();
        //   }
        //   return;
        // }
    
        // const resData = await createDoctorSlotData(tempData);
    
        // if (resData) {
        //   closeTheModal();
        // }
      };

      const doBreak = (data) => {
        BreakDoctorSlotData({
          date: sevenDayData?.commonSchedule?.[data]?.date,
          userId: doctor?._id,
        });
      };
    
      const TakeIndivisualBreak = async (data) => {
        console.log("this is data TakeIndivisualBreak: ", data);
        const tempData = {
          id: data?._id,
          userId: doctor?._id,
          date: activeDaySlots?.slotsmasters?.date,
          boolBreak: data?.boolBreak,
        };
        console.log("this is data TakeIndivisualBreak tempData", tempData);
        // TODO : change this event 
        socket.emit("takeBreakIndivisual", tempData);
      };

  return (
    <>
      {
        <AddEditModal
          maxWidth="lg"
          handleClose={closeTheModal}
          handleSubmit={handleSubmit(submitData)}
          open={createTimingModal}
          modalTitle={
            doctorCalenderEditData || doctorCalenderEditData == 0
              ? `Update Doctor Calender`
              : `Add Doctor Calender`
          }
          isEdit={doctorCalenderEditData || doctorCalenderEditData == 0}
          Loading={doctorCalenderLoading}>
          <Box component="form" onSubmit={handleSubmit(submitData)} p={1}>
            <Grid
              container
              spacing={{ md: 3, xs: 2 }}
              // columns={{ xs: 4, sm: 8, md: 12 }}
              justifyContent="space-between"
              alignItems="center">

              {!(doctorCalenderEditData || doctorCalenderEditData == 0) && (
                <Grid xs={12} sm={12}>
                  <Controller
                    name="day"
                    control={control}
                    rules={{ required: "day is required" }}
                    render={({ field, fieldState: { error } }) => {
                      const { onChange, value, ref, onBlur } = field;
                      return (
                        <CustomAutoCompelete
                          onChange={onChange}
                          lable={"Select day"}
                          hasError={error}
                          value={value}
                          onBlur={onBlur}
                          inputRef={ref}
                          options={remainingDays}
                          getOptionLabel={(option) => option.label}
                        />
                      );
                    }}
                  />
                  {errors.day && (
                    <Typography variant="caption" color="error">
                      Day is required
                    </Typography>
                  )}
                </Grid>
              )}
              {
                watchSchedule.map((_data,index) => (

                <Grid xs={12} sm={12} marginTop={3} borderRadius={5} padding={3} sx={{ "&":{
                  border:"1px solid #d3d3d3",
                }, "&:hover":{
                      boxShadow:"rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
                      transition:"box-shadow 0.3s ease-in-out",
                      border:"none"
                } }}>
                  
                  <Grid xs={12} display={"flex"} justifyContent={"flex-end"}>
                    <div onClick={()=>removeSchedule(index)} style={{width:20,height:20,borderRadius:"100%",background:"#D3D3D3",marginBottom:10,cursor:"pointer"}}>
                      <CustomIconButton color='white' fontSize='small' iconName="clear" ></CustomIconButton>
                    </div>
                  </Grid>

                  <Grid xs={12} sm={12}>
                    <Controller
                    name={`schedule.${index}.branch`}
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
                    errors?.schedule?.[index]?.branch && <Typography variant="caption" color="error">branch is required</Typography> 
                  }
                  </Grid>

                  <Grid xs={12} sm={12} marginTop={2}>
                <Controller
                  name={`schedule.${index}.startTime`}
                  control={control}
                  rules={{
                    required: {
                      valueAsDate: true,
                      value: true,
                      message: "StartTime is required",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => {
                    const { onChange, value, ref} = field;
                    return (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimePicker
                            sx={{
                              "&":{
                                width: "100%",
                              },
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
                            ref={ref}
                            label="Select StartTime"
                            // views={["hours", "minutes"]}
                            // format="hh:mm"
                            // ampm={false}
                          />
                        </LocalizationProvider>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </>
                    );
                  }}
                />
                  </Grid>

                  <Grid xs={12} sm={12} marginTop={2}>
                    <Controller
                      name={`schedule.${index}.endTime`}
                      control={control}
                      rules={{
                        required: { value: true, message: "EndTime is required" },
                      }}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref } = field;
                        return (
                          <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimePicker
                                sx={{
                                  "&":{
                                    width: "100%",
                                  },
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
                                ref={ref}
                                label="Select EndTime"
                                // views={["hours", "minutes"]}
                                // format="hh:mm"
                                // ampm={false}
                                // ampmInClock={false}
                              />
                            </LocalizationProvider>
                            {error && (
                              <Typography variant="caption" color="error">
                                {error.message}
                              </Typography>
                            )}
                          </>
                        );
                      }}
                    />
                  </Grid>

                  <Grid xs={12} sm={12} marginTop={2}>
                    <CustomTextInputField
                      type="number"
                      name={`schedule.${index}.sessionDuration`}
                      control={control}
                      label={"Session Time"}
                      rules={{
                        valueAsNumber: true,
                        required: {
                          value: true,
                          message: "session time is required",
                        },
                        min: {
                          value: 1,
                          message: "session time must be greater then 0",
                        },
                      }}
                    />
                  </Grid>

                  </Grid>
                )) 
              }
              <Grid marginTop={2} display={"flex"} justifyContent={"flex-end"} xs={12}>
              <CustomButton onClick={addTimingInSchdule} buttonText={"Add Timing"}></CustomButton>
              </Grid>
            </Grid>
          </Box>
        </AddEditModal>
      }
      <div>
          <div className={BoxCalsses.slotsContainer} onMouseDownCapture={startDragging} onMouseMove={move} onMouseDown={startDragging} onMouseUp={stopDragging} onMouseLeave={stopDragging} ref={parentRef}>
            {remainingDays?.length > 0 && (
              <div
                className={BoxCalsses.createSlots}
                onClick={() => setCreateTimingModal(true)}>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<CustomAddIcons />}>
                  {" "}
                  Add Timing Of WeekDays
                </Button>
              </div>
            )}
            {Array.isArray(sevenDayData) &&
              sevenDayData?.map((item, index) => {
                return (
                  <RenderBox
                    key={index}
                    doBreak={doBreak}
                    index={index}
                    day={item.day}
                    date={item?.date}
                    scheduleData={item.schedule}
                    HandleSlotDataIndex={HandleSlotDataIndex}
                  />
                );
              })}
          </div>

          <div className={BoxCalsses.slotsContainerMini}>
            <div className={BoxCalsses.slotsHeading}>
              <div style={{display:"flex", flexDirection:"column"}}>
                {doctor?.userName && <span>{doctor?.userName}'s Slots</span>}
                <span>Branch : {location?.location}</span> 
              </div>
              {activeDaySlots?.[0]?.date && (
                <span className={BoxCalsses.text_icon_align}>
                  {" "}
                  <CalendarMonthOutlinedIcon style={{ fontSize: "28px" }} />{" "}
                  {new Date(activeDaySlots?.[0]?.date).toLocaleDateString("en-CA").toString()}
                </span>
              )}
            </div>
            <div className={BoxCalsses.colorShowSlots}>
              {/**  booked break   */}
              {dataColorSow.map(({ color, label }, index) => (
                <ColorRender color={color} label={label} key={index} />
              ))}
            </div>
            <div className={BoxCalsses.slotBodyContainer}>
              {activeDaySlots?.map((item, index) => {

                return  <>
                 {index > 0 && <Divider />}
                  <div className={BoxCalsses.slotBody}> 
                  { 
                    item.allSlots.slots.map((item2) => {
                     return <SlotSBoxRender
                      key={index}
                      {...item2}
                      TakeIndivisualBreak={TakeIndivisualBreak}
                      slotBreak={item2?.break}
                    />
                    }) 
                  }
                </div>
                </>
              })}
            </div>
          </div>
      </div>
    </>
  );
}

export default DoctorSlotsByDate;
