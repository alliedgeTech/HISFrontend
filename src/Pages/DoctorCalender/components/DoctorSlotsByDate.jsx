import React, { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../../socket";
import { useDispatch, useSelector } from "react-redux";
import { setSocketConnected } from "../../../slices/socket.slice";
import {
  setActiveDaySlotIndex,
  setActiveDaySlots,
  setDoctorCalenderEditData,
  setDoctorCalenderLoading,
  setLeveRoomDate,
  setRemainingDays,
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
  leftTime,
  startTime,
  sessionTime,
  doBreak,
  HandleSlotDataIndex,
}) {
  const [MenuItemControl, setMenuItemControl] = useState(null);
  const dispatch = useDispatch();
  const handleClose = () => {
    setMenuItemControl(null);
  };
  const { activeDaySlotIndex } = useSelector((state) => state.doctorCalender);
  console.log("who is activeDaySlotIndex : ", activeDaySlotIndex, index);
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
      <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>StartTime</span> : {startTime}
      </div>
      <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>leftTime</span> : {leftTime}
      </div>
      <div className={BoxCalsses.obj}>
        <span className={BoxCalsses.title}>SessionTime</span>: {sessionTime}
      </div>
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
    sevenDayData,
    loading,
    remainingDays,
    doctorCalenderEditData,
    doctorCalenderLoading,
    activeDaySlots,
    activeDaySlotIndex,
    leaveRoomDate,
  } = useSelector((state) => state.doctorCalender);
  const { isConnected } = useSelector((state) => state.socket);
  const [createTimingModal, setCreateTimingModal] = useState(false);
  const { createDoctorSlotData, updateDoctorSlotData, BreakDoctorSlotData } =
    useDoctorMasterData();

    let mouseDown = false;
    let startX, scrollLeft;
    const parentRef = useRef(null);
  
    const startDragging = (e) => {
      mouseDown = true;
      console.log("this is start dragging" ,e.pageX, parentRef.current.offsetLeft );
      startX = e.pageX - parentRef.current.offsetLeft;
      scrollLeft = parentRef.current.scrollLeft;
    }
    
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
    let temp = `${
      date
        ? new Date(date).toLocaleDateString("en-CA").toString()
        : new Date().toLocaleDateString("en-CA").toString()
    }${doctor?._id?.toString()}`;

    if (temp === "Invalid Date") {
      temp =
        new Date().toLocaleDateString("en-CA").toString() +
        doctor?._id?.toString();
    }

    return temp;
  }

  console.log("this is active this si sevem days data : ", sevenDayData);

  let roomId = getRoomId();

  function getCurrentWeekDateByDay(dayName) {
    console.log("we got the day like this: ", dayName);
    const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const today = new Date();
    const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const targetDayIndex = daysOfWeek.indexOf(dayName.toLowerCase());
    let daysToAdd = targetDayIndex - currentDayIndex;

    if (daysToAdd < 0) {
      // If the target day is earlier in the week, add 7 days to get the next occurrence.
      daysToAdd += 7;
    }

    if (daysToAdd === 0) {
      // If the target day is today, return today's date.
      console.log("this is today date :", today);
      return today;
    }

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);

    return nextDate;
  }

  const responceIndivisualBreakHandler = useCallback((data) => {
      let activeDaySlotsRef = activeDaySlots?.slotsmasters?.slot;
      if(!Array.isArray(activeDaySlotsRef)) return; 
      const tempData = {...activeDaySlots};
      tempData.slotsmasters.slot = tempData.slotsmasters.slot.map((obj) => {
        return obj._id===data._id ? {...obj,break:data.value} : obj ;
      })
      dispatch(setActiveDaySlots(tempData));
  },[activeDaySlots]);

  useEffect(() => {
    function onConnect() {
      console.log("socket is connected");
      dispatch(setSocketConnected(true));
      dispatch(
        setLeveRoomDate(new Date().toLocaleDateString("en-CA").toString())
      );
      socket.emit("joinRoom", [roomId, roomId + "_slots"], "doctor_slots");
      // socket.emit('joinRoom',`${roomId}_slots`,"admin");
    }

    function onDisconnect() {
      console.log("socket disconnedted");
      dispatch(setSocketConnected(false));
    }

    function connect() {
      console.log("this function run ");
      socket.connect();
    }

    function disconnect() {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    }

    connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("doctorCalenderData", (data) => {
      dispatch(setDoctorCalenderLoading(true));
      console.log("this is data from socket yeyeyeyyeye: ", data);
      if (data) {
        const currentDate = new Date();
        const tempData = data.commonSchedule.map((obj, index) => ({
          ...obj,
          date: getCurrentWeekDateByDay(obj?.dayName)
            .toLocaleDateString("en-CA")
            .toString(),
        }));
        data.commonSchedule = tempData;
        dispatch(setSeveDayData(data));
        const DayData = [
          { name: "mon", index: 0 },
          { name: "tue", index: 1 },
          { name: "wed", index: 2 },
          { name: "thu", index: 3 },
          { name: "fri", index: 4 },
          { name: "sat", index: 5 },
          { name: "sun", index: 6 },
        ];

        // Extract the indices from tempData
        const indicesToRemove = data?.commonSchedule?.map((item) => item.index);

        // Filter DayData to remove elements with matching indices
        const updatedDayData = DayData.filter(
          (item) => !indicesToRemove.includes(item.index)
        );

        dispatch(setRemainingDays(updatedDayData));
        dispatch(setDoctorCalenderLoading(false));
      } else {
        toast.error("Something went wronge in socket");
      }
    });
    socket.on("soltsData", (data) => {
      dispatch(setActiveDaySlots(data));
      console.log("slotData", data);
    });
    
    return () => {
      dispatch(setActiveDaySlotIndex(0));
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("soltsData");
      socket.off("doctorCalenderData");
      socket.emit("leaveRoom",leaveRoomDate + doctor?._id + "_slots");
      disconnect();
      console.log("component is unmounted");
    };
  }, []);

  useEffect(() => {
    socket.on("responce_takeBreakIndivisual" ,responceIndivisualBreakHandler);
  },[activeDaySlots])


  function HandleSlotDataIndex(index) {
    console.log("this is index @: ", index);
    if (activeDaySlotIndex === index) {
      console.log(
        "i am emit the event that is joinRoom Date : same date click"
      );
      return;
    }
    console.log(
      "i am emit the event that is joinRoom Date :  this is check is connected or not : ",
      isConnected
    );

    if (sevenDayData && isConnected) {
      dispatch(setActiveDaySlotIndex(index));
      socket.emit("leaveRoom", leaveRoomDate + doctor?._id + "_slots");
      const { date } = sevenDayData?.commonSchedule?.[index];
      console.log("i am emit the event that is joinRoom Date : ", date);
      socket.emit("joinRoom", [`${getRoomId(date)}_slots`], "slots");
      dispatch(setLeveRoomDate(date));
    } else {
      socket.connect();
      toast.error("Please refresh the page");
    }
  }

  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      day: null,
      startTime: null,
      leftTime: null,
      sessionTime: null,
    },
    mode: "onTouched",
  });

  const watchStarttime = watch("startTime");

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
    console.log("this is doctorEditData", doctorCalenderEditData);
    if (
      (doctorCalenderEditData || doctorCalenderEditData == 0) &&
      Number.isInteger(doctorCalenderEditData)
    ) {
      const tempData = sevenDayData?.commonSchedule?.[doctorCalenderEditData];
      console.log("tempData$", tempData);

      const newData = {
        ...tempData?.doctorTime,
        date: tempData?.date,
        day: { name: tempData?.dayName },
        startTime: StringToCorrectDate(tempData?.doctorTime?.startTime),
        leftTime: StringToCorrectDate(tempData?.doctorTime?.leftTime),
      };

      reset({ ...newData });
      setCreateTimingModal(true);
      // console.log("newData",newData);
    }
  }, [doctorCalenderEditData]);

  const closeTheModal = () => {
    setCreateTimingModal(false);
    dispatch(setDoctorCalenderEditData(null));
    reset({
      day: null,
      startTime: null,
      leftTime: null,
      sessionTime: null,
    });
    clearErrors();
  };

  const SetTwoMinimumLength = (value) => {
    return String(value).padStart(2, "0");
  };

  const submitData = async (data) => {
    const compareWith =
      sevenDayData?.commonSchedule?.[doctorCalenderEditData]?.doctorTime;
    let tempData = {};
    console.log("data", data);
    // console.log("this is start time : ",data.startTime.$H.length < 2 ? 'babu' : "op",data.startTime.$H);
    console.log(
      "this is left time : ",
      `${data.leftTime.$H}:${data.leftTime.$m}`,
      compareWith?.leftTime
    );
    let MakeCombo;
    MakeCombo = `${SetTwoMinimumLength(
      data.startTime.$H
    )}:${SetTwoMinimumLength(data.startTime.$m)}`;
    if (MakeCombo != compareWith?.startTime) {
      tempData.startTime = MakeCombo;
      if (MakeCombo < compareWith?.startTime) {
        tempData.startTimeAdditional = {
          oldStartTime: compareWith?.startTime,
          sessionTime: data.sessionTime,
        };
      }
    }

    MakeCombo = `${SetTwoMinimumLength(data.leftTime.$H)}:${SetTwoMinimumLength(
      data.leftTime.$m
    )}`;
    if (MakeCombo != compareWith?.leftTime) {
      tempData.leftTime = MakeCombo;
      if (MakeCombo > compareWith?.leftTime) {
        tempData.leftTimeAdditional = {
          oldleftTime: compareWith?.leftTime,
          sessionTime: data.sessionTime,
        };
      }
    }
    if (data.sessionTime != compareWith?.sessionTime) {
      tempData.sessionTime = data.sessionTime;
    }
    tempData = {
      ...tempData,
      userId: doctor?._id,
      date: data?.date,
      day: data?.day?.name,
    };

    console.log("tempData", tempData);

    if (doctorCalenderEditData || doctorCalenderEditData == 0) {
      tempData["_id"] = data._id;
      console.log("this is final data : ", tempData);
      const resData = await updateDoctorSlotData({
        ...tempData,
        userId: doctor?._id,
      });

      if (resData) {
        closeTheModal();
      }
      return;
    }

    const resData = await createDoctorSlotData(tempData);

    if (resData) {
      closeTheModal();
    }
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
              <Grid xs={12} sm={4}>
                <Controller
                  name="startTime"
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
                            views={["hours", "minutes"]}
                            format="hh:mm:a"
                            ampm={false}
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

              <Grid xs={12} sm={4}>
                <Controller
                  name="leftTime"
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
                            views={["hours", "minutes"]}
                            format="hh:mm:a"
                            ampm={false}
                            ampmInClock={false}
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

              <Grid xs={12} sm={4}>
                <CustomTextInputField
                  type="number"
                  name={"sessionTime"}
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

              {!(doctorCalenderEditData || doctorCalenderEditData == 0) && (
                <Grid xs={12} sm={4}>
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
                          getOptionLabel={(option) => option.name}
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
            {Array.isArray(sevenDayData?.commonSchedule) &&
              sevenDayData?.commonSchedule?.map((item, index) => {
                return (
                  <RenderBox
                    key={index}
                    doBreak={doBreak}
                    index={index}
                    day={item?.dayName}
                    date={item?.date}
                    leftTime={item?.doctorTime?.leftTime}
                    startTime={item?.doctorTime?.startTime}
                    sessionTime={item?.doctorTime?.sessionTime}
                    HandleSlotDataIndex={HandleSlotDataIndex}
                  />
                );
              })}
          </div>
        <div className={BoxCalsses.slotsContainerMini}>
          <div className={BoxCalsses.slotsHeading}>
            {doctor?.userName && <span>{doctor?.userName}'s Slots</span>}
            {activeDaySlots?.slotsmasters?.date && (
              <span className={BoxCalsses.text_icon_align}>
                {" "}
                <CalendarMonthOutlinedIcon style={{ fontSize: "28px" }} />{" "}
                {new Date(activeDaySlots?.slotsmasters?.date).toLocaleDateString("en-CA").toString()}
              </span>
            )}
          </div>
          <div className={BoxCalsses.colorShowSlots}>
            {/**  booked break   */}
            {dataColorSow.map(({ color, label }, index) => (
              <ColorRender color={color} label={label} key={index} />
            ))}
          </div>
          <div className={BoxCalsses.slotBody}>
            {activeDaySlots?.slotsmasters?.slot?.map((item, index) => {
              return (
                <SlotSBoxRender
                  key={index}
                  {...item}
                  TakeIndivisualBreak={TakeIndivisualBreak}
                  slotBreak={item?.break}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorSlotsByDate;
