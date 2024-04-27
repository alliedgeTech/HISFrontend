import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Box, LinearProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";
import toast from "react-hot-toast";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useDeferredValue } from "react";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import AddIcon from '@mui/icons-material/Add';
import APIManager from "../../utils/ApiManager";
import { useSecretoryAppointmentData } from "../../services/Consultant Dashboard/secretoryAppointment";
import TableClasses from "../../Components/TableMainBox/TableMainBox.module.css";
import { useFrontOfficeRegistration } from "../../services/FrontOffice/Registration";
import { setDoctorSecretoryAppointmentList, setNewSecretoryAppointmentData, setRemoveSecretoryAppointmentData, setSecretoryAppointmentCurrentSocketRooms, setSecretoryAppointmentEditData, setSecretoryAppointmentPagination, setSecretoryAppointmentUpdatedData, setSecretoryEndDate, setSecretoryStartDate } from "../../slices/secretoryappointment.slice";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import CustomButton from "../../Components/Button/Button";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";
import CustomDatePickerField from "../../Components/InputsFilelds/CustomDatePickerField";
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";
import SearchRegistration from "../Appointment/components/SearchRegistration";
import SelectSlotModal from "../Appointment/components/SelectSlotModal";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import CommonTable from "../../Components/CommonTable/CommonTable";
import EmptyData from "../../Components/NoData/EmptyData";
import socket from "../../socket";
import { VisitTypeData } from "../../Constants/index.constant";
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import CustomAddIcons from "../../Components/CustomeIcons/CustomAddIcons";


const ApiManager = new APIManager();

function SecretoryAppointment() {
  const dispatch = useDispatch();
  const {
    secretoryAppointmentData,
    secretoryAppointmentLoading,
    secretoryAppointmentEditData,
    secretoryAppointmentCount,
    secretoryAppointmentPagination: paginationModel,
    secretoryStartDate,
    secretoryEndDate,
    doctorSecretoryAppointmentList,
  } = useSelector((state) => state.secretoryAppointment);
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
      startDate: secretoryStartDate,
      endDate: secretoryEndDate,
      doctorAppointmentList: doctorSecretoryAppointmentList,
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
    secretoryAppointmentListLoading,
    createAppointmentData,
    getAppointmentData,
    updateAppointmentData,
    cancelAppointment,
    rescheduleAppointment
  } = useSecretoryAppointmentData();
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
          if(tempData?._id) {
            dispatch(setSecretoryAppointmentUpdatedData(tempData));
          }
          break;
        case "add":
          if(tempData) {
            dispatch(setNewSecretoryAppointmentData(tempData))
          }
          break;
        case "remove":
          if(tempData) {
            dispatch(setRemoveSecretoryAppointmentData({data:tempData,getAppointmentData}))
          }
          break;
      }
    })
    
    return () => {
      socket.off('allAppointmentListing');
    };
  }, []);

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
      setSecretoryAppointmentPagination({ page: 0, pageSize: paginationModel.pageSize })
    );
    getAppointmentData(
      false,
      0,
      undefined,
      "conName",
      undefined,
      undefined,
      undefined,
      value
    );
  }

  useEffect(() => {
    let timeout;
    if (SearchValue) {
      timeout = setTimeout(() => {
        FetchTheNewList(SearchValue);
      }, 300);
    } else if (SearchValue == "") {
      getAppointmentData(
        false,
        0,
        undefined,
        "date",
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
    dispatch(setSecretoryAppointmentEditData(false));
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
    setLeftDrawer(open);
  };

  const setSomeSearchDataInForm = (data) => {
    setRegistrationModalData(data._id);
  };

  const submitData = async (data) => {

    if (!data.time && !data.appointmentDate) {
      toast.error("Please select the slot");
      return;
    }

    if (secretoryAppointmentEditData) {
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
      dispatch(setSecretoryAppointmentPagination({ page, pageSize }));

      if (page !== recentData.page) {
        const resData = await getAppointmentData(true, page, pageSize);
        if (!resData) {
          dispatch(setSecretoryAppointmentPagination(recentData));
        }
      } else {
        const resData = await getAppointmentData(true, 0, pageSize);

        if (!resData) {
          dispatch(setSecretoryAppointmentPagination(recentData));
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
        visitType: element?.visitType,
        mobileNo: element?.registration?.mobileNo,
        bloodGroup: element?.registration?.bloodGroup,
        city: element?.registration?.city?.cityName,
        jwt: element?.jwt,
        inTime: element?.inTime,
        time:element?.time
      };
      array.push(thisData);
    });
    return array;
  };

  const responceRescheduleAppointment = async (data) => {

    if(data?.slot && data?.date) {
      let tempObj = {
        appointmentId:appointmentRescheduleData._id,
        newSlotId:data.slot,
        newSlotDate:data.date,
      }      
      await rescheduleAppointment(tempObj);
    }
    setAppointmentRescheduleData(null);
  }

  const setValueFormSelectSlot = (data) => {
    setValue("appointmentDate", data.date);
    setValue("time", data.slot);
  };

  const rowData = useMemo(() => {
    if (
      secretoryAppointmentData &&
      Array.isArray(secretoryAppointmentData) &&
      secretoryAppointmentListLoading === false
    ) {
      return setRows(secretoryAppointmentData);
    }
  }, [secretoryAppointmentData, secretoryAppointmentListLoading]);

  function GenrateJwtToken({ _id, userId, checkDate }) {
    if (checkDate?.slice(0, 10) != dayjs().format("YYYY-MM-DD")) {
      toast.error("You can only generate token for today's appointment");
      return;
    }
    socket.emit("generateJwtToken",{ _id, userId, date: dayjs().format("YYYY-MM-DD") });
  }

  const tempData = structuredClone(secretoryAppointmentData);

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
        params.row.jwt ? (
          params.row.jwt
        ) : (
         params.row.time &&  <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              GenrateJwtToken({
                _id: params?.row?._id,
                userId: params?.row?.doctor?._id,
                checkDate: params?.row?.appointmentDate,
              })
            }>
            <AddTaskOutlinedIcon />
          </div>
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
              dispatch(setSecretoryAppointmentEditData(true));
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
    const watchStartDate = watch("startDate");

    const getListAccordingDoctorDate = async (data) => {
      let dataChanged = false;
      let newStartDate = dayjs(data.startDate).format("YYYY-MM-DD");
      let newEndDate = dayjs(data.endDate).format("YYYY-MM-DD");

      if (doctorSecretoryAppointmentList?._id !== data.doctorAppointmentList?._id) {
        dataChanged = true;
      } else if (secretoryStartDate !== newStartDate) {
        dataChanged = true;
      } else if (secretoryEndDate != newEndDate) {
        dataChanged = true;
      }

      if (dataChanged) {
        if (newEndDate < newStartDate) {
          toast.error("please select end date bigger then start date");
          return;
        }
        dispatch(setSecretoryStartDate(newStartDate));
        dispatch(setSecretoryEndDate(newEndDate));
        dispatch(setDoctorSecretoryAppointmentList(data.doctorAppointmentList));
        dispatch(
          setSecretoryAppointmentPagination({
            page: 0,
            pageSize: paginationModel.pageSize,
          })
        );
        const innerResData = await getAppointmentData(
          true,
          0,
          undefined,
          undefined,
          newStartDate,
          newEndDate,
          data.doctorAppointmentList
        );
        if (!innerResData) {
          setLeftDrawer(true);
          return;
        }
        dispatch(setSecretoryAppointmentCurrentSocketRooms({startDate:newStartDate,endDate:newEndDate,doctorId:data?.doctorAppointmentList?._id}));
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
              loading={secretoryAppointmentListLoading}
              type={"submit"}
              buttonText={"Save"}></CustomButton>
          </Grid>
        </Grid>
      </Box>
    );
  }, [doctorSecretoryAppointmentList, control, secretoryAppointmentListLoading,secretoryStartDate,secretoryEndDate]);

  return (
    <>
      <AddEditModal
        maxWidth="lg"
        handleClose={closeTheModal}
        handleSubmit={handleSubmit(submitData)}
        open={ModalOpen}
        modalTitle={
          secretoryAppointmentEditData ? `Update Appointment` : `Add Appointment`
        }
        isEdit={!!secretoryAppointmentEditData}
        Loading={secretoryAppointmentLoading}>
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
                      disable={secretoryAppointmentEditData}
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
                disable={secretoryAppointmentEditData}
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

            {!secretoryAppointmentEditData && (
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
        {secretoryAppointmentListLoading ? (
          <>
            <LinearProgress />
            <TableSkeleton />
          </>
        ) : Array.isArray(rowData) && rowData.length > 0 ? (
          <CommonTable
            columns={columns}
            count={secretoryAppointmentCount}
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

export default SecretoryAppointment;
