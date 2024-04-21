import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAppointmentBranch,
  setAppointmentCurrentSocketRooms,
  setAppointmentData,
  setAppointmentEditData,
  setAppointmentUpdatedData,
  setAppointmentpagination,
  setEndDate,
  setNewAppointmentData,
  setRemoveAppointmentData,
  setRemovedAppointmentJwtData,
  setShowDoctorAppointment,
  setStartDate,
} from "../../slices/appointment.slice";
import { useAppointmentData } from "../../services/Consultant Dashboard/Appointment";
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import EmptyData from "../../Components/NoData/EmptyData";
import { useForm, Controller } from "react-hook-form";
import { Box, LinearProgress, Typography } from "@mui/material";
import CustomDatePickerField from "../../Components/InputsFilelds/CustomDatePickerField";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Grid from "@mui/material/Unstable_Grid2";
import APIManager from "../../utils/ApiManager";
import { useFrontOfficeRegistration } from "../../services/FrontOffice/Registration";
import SearchIcon from "@mui/icons-material/Search";
import CustomButton from "../../Components/Button/Button";
import SearchRegistration from "./components/SearchRegistration";
import dayjs from "dayjs";
import SelectSlotModal from "./components/SelectSlotModal";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";
import toast from "react-hot-toast";
import TableClasses from "../../Components/TableMainBox/TableMainBox.module.css";
import CustomAddIcons from "../../Components/CustomeIcons/CustomAddIcons";
import HandleStepOneClasses from "../DoctorCalender/components/handleStepOne.module.css";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useDeferredValue } from "react";
import CommonTable from "../../Components/CommonTable/CommonTable";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import { VisitTypeData } from "../../Constants/index.constant";
import AddIcon from '@mui/icons-material/Add';
import socket from "../../socket";

const ApiManager = new APIManager();

function Appointment() {
  const dispatch = useDispatch();
  const {
    appointmentData,
    appointmentLoading,
    appointmentEditData,
    appointmentCount,
    appointmentPagination: paginationModel,
    branch,
    startDate,
    endDate,
    doctorAppointmentList,
  } = useSelector((state) => state.appointment);
  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      doctor: null,
      appointmentType: "walkin",
      appointmentDate: "",
      registration: null,
      mobileNo: "",
      visitType: null,
      title: null,
      pationName: "",
      dob: "",
      age: "",
      gender: null,
      address: "",
      city: null,
      otherRemarks: "",
      time: "",
      email: "",
      startDate: startDate,
      endDate: endDate,
      doctorAppointmentList: doctorAppointmentList,
      appointmentBranch: branch,
    },
    mode: "onTouched",
  });
  let TodayDate = new Date().toLocaleDateString("en-CA").toString();
  const [ModalOpen, setModalOpen] = useState(false);
  const [newRegistrationForm, setNewRegistrationForm] = useState(false);
  const [RegistrationNumberFound, setRegistrationNumberFound] = useState(false);
  const [SeachRegistrationModal, setSeachRegistrationModal] = useState(false);
  const [selectSlotModal, setSelectSlotModal] = useState(false);
  const [showSlotSelect, setShowSlotSelect] = useState(false);
  const [LeftDrawer, setLeftDrawer] = useState(false);
  const [SearchValue, setSearchValue] = useState(null);
  const [appointmentReschedule, setAppointmentReschedule] = useState(null);
  const [appointmentRescheduleData, setAppointmentRescheduleData] = useState(null);

  const {
    appointmentListLoading,
    createAppointmentData,
    getAppintmentData,
    updateAppointmentData,
    cancelAppointment,
    rescheduleAppointment
  } = useAppointmentData();
  const { getRegistrationData } = useFrontOfficeRegistration();
  const DoctorWatch = watch("doctor");
  const watchSlot = watch("time")
  const defferedSlot = useDeferredValue(watchSlot );
  const setRegistrationModalData = async (tempData) => {
    let url = `admin/frontOffice/registration/m/${tempData}?type=id`;

    const data = await ApiManager.get(url);

    if (data.error) {
      toast.error("Something went wrong!");
      setNewRegistrationForm(false);  
      setRegistrationNumberFound(false);
      return;
    }

    setNewRegistrationForm(true);
    if (data?.data?.data) {
      const tempData = {
        ...data?.data?.data,
        gender: { gender: data?.data?.data?.gender },
      };

      setRegistrationNumberFound(tempData?._id);
      console.log("this is temp data : ", tempData);

      const fieldSet = [
        "pationName",
        "title",
        "dob",
        "age",
        "gender",
        "address",
        "city",
        "otherRemarks",
        "email",
        "mobileNo",
        // "doctor",
      ];
      clearErrors();
      for (let i of fieldSet) {
        setValue(i, tempData[i]);
      }
    } else {
      setRegistrationNumberFound(false);
      const fieldSet = [
        "pationName",
        "dob",
        "age",
        "address",
        "otherRemarks",
        "email",
        "mobileNo",
      ];
      for (let i of fieldSet) {
        setValue(i, "");
      }
      const FieldSetNull = ["title", "gender", "city"];
      for (let i of FieldSetNull) {
        setValue(i, null);
      }
    }
  };

  useEffect(() => {
    console.log("this is new count incr : but step 2",appointmentCount);
  },[appointmentCount])

  function newRegistrationAddedOnNumber() {
   
    setNewRegistrationForm(true);
    setRegistrationNumberFound(false);
    const fieldSet = [
      "pationName",
      "dob",
      "age",
      "address",
      "otherRemarks",
      "email",
    ];
    for (let i of fieldSet) {
      setValue(i, "");
    }
    const FieldSetNull = ["title", "gender", "city"];
    for (let i of FieldSetNull) {
      setValue(i, null);
    }
  }

  useEffect(() => {

    socket.on('allAppointmentListing',(data)=>{
      let tempData = data.data;
      switch(data.type) {
        case "update":
          if(tempData) {
            dispatch(setAppointmentUpdatedData(tempData));
          }
          break;
        case "add":
          if(tempData) {
            dispatch(setNewAppointmentData(tempData))
          }
          break;
        case "remove":
          if(tempData) {
            dispatch(setRemoveAppointmentData({data:tempData,getAppintmentData}))
          }
          break;
      }
      
    })
    
    return () => {
      socket.off('allAppointmentListing');
    };
  }, []);

  // useEffect(() => {
  //   if (isValidMobileNumber(defferedMobileNumber)) {
  //     const timeoutId = setTimeout(() => {
  //       setRegistrationModalData();
  //     }, 500);

  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [defferedMobileNumber]);

  useEffect(() => {
    setValue("time",null);
    if (DoctorWatch) {
      setShowSlotSelect(true);
    } else {
      setShowSlotSelect(false);
    }
  }, [DoctorWatch]);

  function FetchTheNewList(value) {
    dispatch(
      setAppointmentpagination({ page: 0, pageSize: paginationModel.pageSize })
    );
    getAppintmentData(
      false,
      0,
      undefined,
      undefined,
      undefined,
      undefined,
      value
    );
  }

  useEffect(() => {
    let timeout;
    if (SearchValue) {
      console.log("We calling api set timeout ");
      timeout = setTimeout(() => {
        console.log("now api calling");
        FetchTheNewList(SearchValue);
      }, 300);
    } else if (SearchValue == "") {
      getAppintmentData(
        false,
        0,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
    }
    return () => clearTimeout(timeout);
  }, [SearchValue]);

  const closeTheModal = () => {
    setModalOpen(false);
    setRegistrationNumberFound(false);
    setNewRegistrationForm(false);
    dispatch(setAppointmentEditData(false));
    reset({
      doctor: null,
      appointmentType: "walkin",
      appointmentDate: "",
      registration: null,
      mobileNo: "",
      visitType: null,
      title: null,
      pationName: "",
      dob: "",
      age: "",
      gender: null,
      address: "",
      city: null,
      otherRemarks: "",
      time: "",
      email: "",
    });
    clearErrors();
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    console.log("we are seted this : ", open);
    setLeftDrawer(open);
  };

  const setSomeSearchDataInForm = (data) => {
    setRegistrationModalData(data._id);
  };

  const submitData = async (data) => {
    console.log("this is form data : ", data);

    if (!data.time && !data.appointmentDate) {
      toast.error("Please select the slot");
      return;
    }

    if (appointmentEditData) {
      const tempData = await updateAppointmentData({
        ...data,
        AppointmentId: data?._id,
        doctor: data.doctor._id,
        visitType: data.visitType.value,
      });

      if (tempData) {
        closeTheModal();
      }
    } else if (newRegistrationForm) {
      if (RegistrationNumberFound) {
        // old registration found
        console.log("this is time : ", data.time);
        const tempData = await createAppointmentData({
          doctor: data.doctor._id,
          appointmentType: data.appointmentType,
          registration: RegistrationNumberFound,
          visitType: data.visitType.value,
          appointmentDate: data.appointmentDate,
          time: data.time,
        });

        if (tempData) {
          closeTheModal();
        }
      } else {
        // new registration
        const tempData = await createAppointmentData({
          doctor: data.doctor._id,
          appointmentType: data.appointmentType,
          visitType: data.visitType.value,
          appointmentDate: data.appointmentDate,
          title: data.title._id,
          age: data?.age,
          pationName: data?.pationName,
          gender: data?.gender?.gender,
          dob: dayjs(data?.dob?.$d)?.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          city: data?.city?._id,
          mobileNo: data?.mobileNo,
          otherRemarks: data?.otherRemarks,
          email: data?.email,
          time: data?.time,
          address: data.address,
        });

        if (tempData) {
          getRegistrationData();
          closeTheModal();
        }
      }
    }
  };

  const onPaginationChange = async ({ page, pageSize }) => {
    if (
      page !== paginationModel.page ||
      pageSize !== paginationModel.pageSize
    ) {
      const recentData = structuredClone(paginationModel);
      dispatch(setAppointmentpagination({ page, pageSize }));

      if (page !== recentData.page) {
        const resData = await getAppintmentData(true, page, pageSize);
        if (!resData) {
          dispatch(setAppointmentpagination(recentData));
        }
      } else {
        const resData = await getAppintmentData(true, 0, pageSize);

        if (!resData) {
          dispatch(setAppointmentpagination(recentData));
        }
      }
    }
  };

  const setRows = (data) => {
    let id = paginationModel.page * paginationModel.pageSize;
    let array = [];
    data?.forEach((element) => {
      let thisData = {
        _id: element?._id,
        id: ++id,
        pationName: element?.registration?.pationName,
        title: element?.registration?.title?.userTitle,
        age: `${element?.registration?.age}`,
        gender: `${element?.registration?.gender}`,
        doctor: element?.doctor,
        appointmentType: element?.appointmentType,
        appointmentDate: element?.appointmentDate,
        appointmentBranch: element?.appointmentBranch,
        visitType: element?.visitType,
        mobileNo: element?.registration?.mobileNo,
        bloodGroup: element?.registration?.bloodGroup,
        city: element?.registration?.city?.cityName,
        jwt: element?.jwt,
        inTime: element?.inTime,
        time:element?.time,
        isActive:element.isActive,
      };
      array.push(thisData);
    });
    return array;
  };

  const responceRescheduleAppointment = async (data) => {
    console.log("this is reschedule slot data responce data : ", data);
    if(data?.slot && data?.date) {
      let tempObj = {
        appointmentId:appointmentRescheduleData._id,
        newSlotId:data.slot,
        newSlotDate:data.date,
      }      
      console.log('toasjkflj;lasjfdjaskf',tempObj)
      await rescheduleAppointment(tempObj);
    }
    setAppointmentRescheduleData(null);
  }

  const setValueFormSelectSlot = (data) => {
    console.log("this is date @", data);
    setValue("appointmentDate", data.date);
    setValue("time", data.slot);
  };

  const rowData = useMemo(() => {
    if (
      appointmentData &&
      Array.isArray(appointmentData) &&
      appointmentListLoading === false
    ) {
      return setRows(appointmentData);
    }
  }, [appointmentData, appointmentListLoading]);

  // function setDoctorAppointmentListDoctor(data) {
  //   console.log("this is selected doctor ", data);
  //   dispatch(setShowDoctorAppointment(data.doctorAppointmentList));
  //   getAppintmentData(
  //     true,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     data.doctorAppointmentList
  //   );
  // }

  function GenrateJwtToken({ _id, userId, checkDate, branch }) {
    console.log("this is id : ", _id, userId,branch,checkDate);
  
    const todayDate = new Date().toLocaleDateString("en-CA",{ timeZone:'Asia/Kolkata' });

    if (checkDate?.slice(0, 10) != todayDate) {
      toast.error("You can token generate for today's appointment");
      return;
    }

    socket.emit("appointment",{data:{ _id, doctorId:userId, date: todayDate, branch},type:"generateJwtToken"},()=>{
      toast.error("token is not generated. Something went wrong");
    });

  }
  const tempData = structuredClone(appointmentData);
  console.log("temp Data:", tempData);

  const columns = [
    {
      field: "_id",
      headerName: "_id",
      width: 0,
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "pationName",
      headerName: "Pation Name",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.row.title} {params.row.pationName}
        </div>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      flex: 1,
    },
    {
      field: "appointmentType",
      headerName: "Appointment Type",
      width: 120,
    },
    {
      field: "visitType",
      headerName: "Visit Type",
      flex: 1,
    },
    {
      field: "jwt",
      headerName: "JWT",
      width: 120,
      renderCell: (params) =>
        params.row.jwt > 0 ? (
          params.row.jwt
        ) : (
         params.row.isActive ?  <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              GenrateJwtToken({
                _id: params?.row?._id,
                userId: params?.row?.doctor?._id,
                checkDate: params?.row?.appointmentDate,
                branch:params.row?.appointmentBranch?._id
              })
            }>
            <AddTaskOutlinedIcon />
          </div> : null
        ),
    },
    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      renderCell: (params) => (
        <div>{params?.row?.appointmentDate?.slice(0, 10)}</div>
      ),
      width: 250,
    },
    {
      field: "doctor",
      headerName: "Doctor",
      renderCell: (params) => <div>{params?.row?.doctor?.userName}</div>,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
         { params.row.time && <div
           style={{cursor:"pointer"}}
            onClick={() => {
              setModalOpen(true);
              clearErrors();
              reset({
                ...params.row,
                visitType: VisitTypeData.find(
                  (d) => d.value == params.row.visitType
                ),
                id:
                  params.row.id -
                  paginationModel.page * paginationModel.pageSize -
                  1,
              });
              dispatch(setAppointmentEditData(true));
            }}>
            <CustomIconButton />
          </div>}
          {
            !params.row.inTime && params.row.time && <div
            style={{marginLeft:"20px",cursor:"pointer"}}
            onClick={() => cancelAppointment(params.row._id) }>
            <CustomIconButton iconName="cancelOutlinedIcon" />
          </div>
          }
          {
            params.row.jwt === 0 && params.row.time && <div
            style={{marginLeft:"20px",cursor:"pointer"}}
            onClick={() => {setAppointmentReschedule(true);setAppointmentRescheduleData(params.row)} }>
            <CustomIconButton iconName="R" />
          </div>
          }


        </>
      ),
    },
  ];

  function CustomHeader() {
    return (
      <div className={TableClasses["tableMainHeader-container"]}>
        <div
          style={{ color: "#25396f", whiteSpace: "nowrap" }}
          className={TableClasses["tableMainHeader-text"]}>
          Appointment Master
        </div>

        <Grid
          container
          spacing={{ md: 3, xs: 2 }}
          justifyContent="center"
          alignItems="center">
          <Grid sm={4}>
            <Controller
              name={"searchValue"}
              control={control}
              render={({
                field: { onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <OutlinedInput
                  type="text"
                  onBlur={onBlur}
                  size="medium"
                  error={!!error}
                  onChange={(e, p) => {
                    console.log({ e, p });
                    setSearchValue(e.target.value);
                    onChange(e, p);
                  }}
                  value={value}
                  fullWidth
                  placeholder="Search"
                  endAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              )}
            />
            {/* <CustomTextInputField
              control={control}
              name={"searchValue"}
              label={"Search"}
              type={"text"}
              /> */}
          </Grid>
          <Grid sm={3}>
            <CustomButton
              buttonText={"filter"}
              onClick={() => {
                setLeftDrawer(true);
              }}
              fullWidth={true}
              size={"large"}
              variant={"contained"}
              startIcon={<TuneOutlinedIcon />}
            />
          </Grid>
          <Grid sm={5}>
            <CustomButton
              fullWidth={true}
              buttonText={"Add Appointment"}
              onClick={() => {
                setModalOpen(true);
                clearErrors();
              }}
              size={"large"}
              variant={"contained"}
              startIcon={<CustomAddIcons />}
            />
          </Grid>
        </Grid>
      </div>
    );
  }

  const LeftSideDrawerList = useCallback(() => {
    const watchDoctor = watch("doctorAppointmentList");
    const watchStartDate = watch("startDate");

    const getListAccordingDoctorDate = async (data) => {
      let dataChanged = false;
      let newStartDate = dayjs(data.startDate).format("YYYY-MM-DD");
      let newEndDate = dayjs(data.endDate).format("YYYY-MM-DD");

      if (doctorAppointmentList?._id !== data.doctorAppointmentList?._id) {
        dataChanged = true;
      } else if (startDate !== newStartDate) {
        dataChanged = true;
      } else if (endDate != newEndDate) {
        dataChanged = true;
      } else if(branch?._id != data.appointmentBranch?._id) {
        dataChanged = true;

      }

      if (dataChanged) {
        if (newEndDate < newStartDate) {
          toast.error("please select end date bigger then start date");
          return;
        }

        dispatch(setStartDate(newStartDate));
        dispatch(setEndDate(newEndDate));
        dispatch(setShowDoctorAppointment(data.doctorAppointmentList));
        dispatch(setAppointmentBranch(data.appointmentBranch));
        dispatch(
          setAppointmentpagination({
            page: 0,
            pageSize: paginationModel.pageSize,
          })
        );
        dispatch(setAppointmentCurrentSocketRooms({startDate:newStartDate,endDate:newEndDate,doctorId:data.doctorAppointmentList._id,branch:data.appointmentBranch._id}));

        const innerResData = await getAppintmentData(
          true,
          0,
          undefined,
          newStartDate,
          newEndDate,
          data.doctorAppointmentList,
          undefined,
          data.appointmentBranch,
        );
        if (!innerResData) {
          setLeftDrawer(true);
          return;
        }
        
      }
      setLeftDrawer(false);
    };

    return (
      <Box
        component="form"
        onSubmit={handleSubmit(getListAccordingDoctorDate)}
        p={3}
        sx={{ width: 350 }}>
        <Typography
          variant="h5"
          style={{
            letterSpacing: "2px",
            marginBottom: "15px",
            color: "#25396f",
            fontWeight: 500,
          }}>
          Filter
        </Typography>
        <Divider />
        <Grid
          container
          spacing={{ md: 3, xs: 2 }}
          justifyContent="space-between"
          alignItems="center">
          <Grid sm={12}>
            <Controller
              name="doctorAppointmentList"
              control={control}
              render={({ field, fieldState: { error } }) => {
                const { onChange, value, ref } = field;
                return (
                  <CustomAutoCompelete
                    clearOnEscape={false}
                    onChange={onChange}
                    lable={"Select Doctor"}
                    disableClearable={true}
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

          <Grid sm={12}>
              <Controller
                name="appointmentBranch"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select Branch"}
                      value={value}
                      onBlur={onBlur}
                      getOptionLabel={(option)=> option.location }
                      filterOnActive={true}
                      url={`admin/locationMaster/location/doctor/${watchDoctor?._id}`}
                      inputRef={ref}
                      hasError={error}
                    />
                  );
                }}></Controller>
            </Grid>

          <Grid sm={12}>
            <CustomDatePickerField
              name={"startDate"}
              control={control}
              label={"startDate"}
            />
          </Grid>

          <Grid sm={12}>
            <CustomDatePickerField
              name={"endDate"}
              control={control}
              label={"endDate"}
              minDate={watchStartDate}
            />
          </Grid>

          <Grid sm={12}>
            <CustomButton
              fullWidth={true}
              loading={appointmentListLoading}
              type={"submit"}
              buttonText={"Save"}></CustomButton>
          </Grid>
        </Grid>
      </Box>
    );
  }, [doctorAppointmentList, control, appointmentListLoading,startDate,endDate]);

  // if (!doctorAppointmentList) {
  //   return (
  //     <div className={HandleStepOneClasses.container}>
  //       <div className={HandleStepOneClasses.Box}>
  //         <Typography className={HandleStepOneClasses.cusTypogrphy}>
  //           Select Doctor
  //         </Typography>
  //         <Box
  //           width={"100%"}
  //           component="form"
  //           onSubmit={handleSubmit(setDoctorAppointmentListDoctor)}
  //           p={1}>
  //           <Grid
  //             container
  //             width={"100%"}
  //             // columns={{ xs: 4, sm: 8, md: 12 }}
  //             justifyContent="center"
  //             alignItems="center">
  //             <Grid sm={12}>
  //               <Controller
  //                 name="doctorAppointmentList"
  //                 control={control}
  //                 render={({ field, fieldState: { error } }) => {
  //                   const { onChange, value, ref } = field;
  //                   return (
  //                     <CustomAutoCompelete
  //                       onChange={onChange}
  //                       lable={"Select Doctor"}
  //                       value={value}
  //                       getOptionLabel={(option) =>
  //                         ` ${option?.userName} / ${option?.speciality?.speciality}`
  //                       }
  //                       url={`admin/userMaster/user/doctor`}
  //                       inputRef={ref}
  //                       hasError={error}
  //                     />
  //                   );
  //                 }}></Controller>
  //             </Grid>
  //           </Grid>
  //           <div className={HandleStepOneClasses.btnContainer}>
  //             <CustomButton buttonText={"Next"} type={"submit"} />
  //           </div>
  //         </Box>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <AddEditModal
        maxWidth="lg"
        handleClose={closeTheModal}
        handleSubmit={handleSubmit(submitData)}
        open={ModalOpen}
        modalTitle={
          appointmentEditData ? `Update Appointment` : `Add Appointment`
        }
        isEdit={!!appointmentEditData}
        Loading={appointmentLoading}>
        <Box component="form" onSubmit={handleSubmit(submitData)} p={3}>
          <Grid
            container
            spacing={{ md: 3, xs: 2 }}
            justifyContent="space-between"
            alignItems="center">
            <Grid xs={12} sm={4}>
              <Controller
                name="doctor"
                control={control}
                rules={{ required: "Doctor is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <CustomAutoCompelete
                      fullWidth={true}
                      onChange={onChange}
                      lable={"Select Doctor"}
                      value={value}
                      getOptionLabel={(option) =>
                        ` ${option?.userName} / ${option?.speciality?.speciality}`
                      }
                      url={"admin/userMaster/user/doctor"}
                      inputRef={ref}
                      disable={appointmentEditData}
                      hasError={error}
                      isOptionEqualToValue={(op, val) => {
                        return op._id == (val || val?._id);
                      }}
                    />
                  );
                }}></Controller>
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="appointmentType"
                control={control}
                rules={{ required: "Appointmnet type is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Appointment Type"}
                      value={value}
                      getOptionLabel={(option) => option}
                      options={["walkin", "scheduled"]}
                      inputRef={ref}
                      hasError={error}
                    />
                  );
                }}></Controller>
            </Grid>

            <Grid xs={12} sm={4}>
              <CustomTextInputField
                key="appointmentMobileNO"
                name={"mobileNo"}
                type={"number"}
                control={control}
                label={"Mobile NO"}
                rules={{
                  required: {
                    value: true,
                    message: "Please enter the mobile number",
                  },
                  minLength: {
                    value: 10,
                    message: "Please enter the min length 10",
                  },
                  maxLength: {
                    value: 10,
                    message: "Please enter the max length 10",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Please enter the valid mobile number",
                  },
                }}
                disable={appointmentEditData}
              />
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="visitType"
                control={control}
                rules={{ required: "Visit type is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Visit Type"}
                      value={value}
                      getOptionLabel={(option) => `${option?.shaw}`}
                      options={VisitTypeData}
                      inputRef={ref}
                      hasError={error}
                    />
                  );
                }}></Controller>
            </Grid>

            {!appointmentEditData && (
              <>
                <Grid xs={12} sm={4}>
                  <CustomButton
                    fullWidth
                    buttonText={"Search Registration"}
                    startIcon={<SearchIcon />}
                    onClick={() =>
                      setSeachRegistrationModal(true)
                    }></CustomButton>
                </Grid>

                <Grid xs={12} sm={4}>
                  <CustomButton
                    disabled={!showSlotSelect}
                    color={ defferedSlot ? "rgb(76, 175, 80)" : undefined}
                    hoverColor={ defferedSlot ? "rgb(76, 175, 80, 0.85)" : undefined}
                    fullWidth
                    buttonText={"Select Slot"}
                    startIcon={<AlarmOutlinedIcon />}
                    onClick={() => setSelectSlotModal(true)}></CustomButton>
                </Grid>

                <Grid xs={12} sm={4}>
                  <CustomButton fullWidth buttonText={'New Registration'} startIcon={<AddIcon />} onClick={newRegistrationAddedOnNumber}></CustomButton>
                </Grid>
              </>
            )}

            {newRegistrationForm && (
              <>
                {" "}
                <Typography
                  variant="h5"
                  style={{ width: "100%" }}
                  mb={3}
                  mt={1}
                  textAlign={"center"}>
                  {" "}
                  {RegistrationNumberFound
                    ? "Old Registration Details"
                    : "New Registration Form"}{" "}
                </Typography>
                <Grid
                  container
                  sm={12}
                  spacing={{ md: 3, xs: 2 }}
                  // columns={{ xs: 4, sm: 8, md: 12 }}
                  justifyContent="space-between"
                  alignItems="center">
                  <Grid xs={12} sm={4}>
                    <Controller
                      name="title"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: "Patition Title is required",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref } = field;
                        return (
                          <CustomAutoCompelete
                            onChange={onChange}
                            lable={"Select Patition Title"}
                            value={value}
                            getOptionLabel={(option) => option?.userTitle}
                            url={"admin/addMaster/title"}
                            filterOnActive={true}
                            inputRef={ref}
                            hasError={error}
                            readOnly={RegistrationNumberFound}
                            isOptionEqualToValue={(op, val) =>
                              op?._id == val?._id
                            }
                          />
                        );
                      }}></Controller>

                    {errors.title && (
                      <Typography variant="caption" color="error">
                        Patition Title is required
                      </Typography>
                    )}
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <CustomTextInputField
                      name={"pationName"}
                      control={control}
                      label={"Patition Name"}
                      rules={{
                        required: {
                          value: true,
                          message: "Patiton Name is required",
                        },
                      }}
                      inputPropsText={{ readOnly: RegistrationNumberFound }}
                    />
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <CustomDatePickerField
                      key={"registration"}
                      name={"dob"}
                      control={control}
                      label={"Date of birth"}
                      rules={{
                        valueAsDate: true,
                        required: {
                          value: true,
                          message: "Please enter the dob",
                        },
                      }}
                      maxDate={TodayDate}
                      inputProps={{ readOnly: RegistrationNumberFound }}
                    />
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <CustomTextInputField
                      name={"age"}
                      type={"number"}
                      control={control}
                      label={"Age"}
                      rules={{
                        required: {
                          value: true,
                          message: "Please enter the age",
                        },
                      }}
                      inputPropsText={{ readOnly: RegistrationNumberFound }}
                    />
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: "Gender is required" }}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref } = field;
                        return (
                          <CustomAutoCompelete
                            onChange={onChange}
                            lable={"Select Gender"}
                            value={value}
                            getOptionLabel={(option) => option?.gender}
                            readOnly={RegistrationNumberFound}
                            options={[
                              { gender: "male" },
                              { gender: "female" },
                              { gender: "other" },
                            ]}
                            inputRef={ref}
                            hasError={error}
                          />
                        );
                      }}></Controller>

                    {errors.gender && (
                      <Typography variant="caption" color="error">
                        {errors.gender.message}
                      </Typography>
                    )}
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <CustomTextInputField
                      name={"address"}
                      control={control}
                      label={"Address"}
                      inputPropsText={{ readOnly: RegistrationNumberFound }}
                      rules={{
                        required: {
                          value: !RegistrationNumberFound,
                          message: "Please enter the address",
                        },
                      }}
                    />
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <Controller
                      name="city"
                      control={control}
                      rules={{ required: "City is required" }}
                      render={({ field, fieldState: { error } }) => {
                        const { onChange, value, ref } = field;
                        return (
                          <CustomAutoCompelete
                            onChange={onChange}
                            lable={"Select City"}
                            readOnly={RegistrationNumberFound}
                            value={value}
                            getOptionLabel={(option) => option?.cityName}
                            url={"admin/regionMaster/city"}
                            filterOnActive={true}
                            inputRef={ref}
                            hasError={!!error}
                            isOptionEqualToValue={(op, val) =>
                              op?._id == val?._id
                            }
                          />
                        );
                      }}></Controller>
                    {errors.city && (
                      <Typography variant="caption" color="error">
                        City is required
                      </Typography>
                    )}
                  </Grid>

                  <Grid xs={12} sm={4}>
                    <CustomTextInputField
                      name={"otherRemarks"}
                      control={control}
                      label={"Other Remarks"}
                      inputPropsText={{ readOnly: RegistrationNumberFound }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <CustomTextInputField
                      name={"email"}
                      control={control}
                      label={"Email Address"}
                      inputPropsText={{ readOnly: RegistrationNumberFound }}
                      rules={{
                        required: { value: true, message: "Email is required" },
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter the valid email address",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </AddEditModal>

      <SwipeableDrawer
        anchor={"right"}
        open={LeftDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}>
        {<LeftSideDrawerList />}
      </SwipeableDrawer>

      <SearchRegistration
        setSeachRegistrationModal={setSeachRegistrationModal}
        SeachRegistrationModal={SeachRegistrationModal}
        setFormDataBySearch={setRegistrationModalData}
        setSomeSearchDataInForm={setSomeSearchDataInForm}
      />

      <SelectSlotModal
        key={selectSlotModal}
        defaultValue={{
          date: getValues("appointmentDate"),
          time: getValues("time"),
        }}
        open={selectSlotModal}
        setSelectSlotModal={setSelectSlotModal}
        doctor={DoctorWatch}
        setValueFormSelectSlot={setValueFormSelectSlot}
      />

      <SelectSlotModal
        key={appointmentReschedule}
        buttonText={"Reschedule Appointment"}
        defaultValue={{
          date: appointmentRescheduleData?.appointmentDate,
          time: appointmentRescheduleData?.time,
        }}
        open={appointmentReschedule}
        setSelectSlotModal={setAppointmentReschedule}
        doctor={appointmentRescheduleData?.doctor}
        setValueFormSelectSlot={responceRescheduleAppointment}
      />

      <TableMainBox customHeader={CustomHeader()}>
        {console.log("this is time to render again")}
        {appointmentListLoading ? (
          <>
            <LinearProgress />
            <TableSkeleton />
          </>
        ) : Array.isArray(rowData) && rowData.length > 0 ? (
          <CommonTable
            columns={columns}
            count={appointmentCount}
            activeInActiveNeeded={true}
            paginationModel={paginationModel}
            customHeight="248px"
            rowData={rowData}
            getRowClassName={(params) => !params.row.time && 'inactive-row' }
            onPaginationChange={onPaginationChange}
          />
        ) : (
          <EmptyData />
        )}
      </TableMainBox>
    </>
  );
}

export default Appointment;
