import React, { useEffect, useMemo, useState } from "react";
import { useSocMasterData } from "../../services/Billing/SocMaster";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setSocEditData, setSocPagination } from "../../slices/soc.slice";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import CommonTable from "../../Components/CommonTable/CommonTable";
import EmptyData from "../../Components/NoData/EmptyData";
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import { Box, LinearProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useDeferredValue } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CustomDatePickerField from "../../Components/InputsFilelds/CustomDatePickerField";
import Divider from "@mui/material/Divider";
import UndoIcon from "@mui/icons-material/Undo";
import Chip from "@mui/material/Chip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useTransition } from "react";
import toast from "react-hot-toast";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import { height } from "@mui/system";
import { CustomTextInputFieldWithoutController } from "../../Components/InputsFilelds/CustomTextFieldsWithoutController";
import CustomDatePickerFieldWithoutController from "../../Components/InputsFilelds/CustomDatePicketWithoutController";

function SocMaster() {
  const {
    createSocMaster,
    getSocMasterData,
    listLoading,
    updateSocMaster,
    getSocMasterDataById,
  } = useSocMasterData();
  const {
    socData,
    socLoading,
    editSocData,
    socCount,
    socPagination: paginationModel,
    bedTypeData,
  } = useSelector((state) => state.soc);
  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    getValues,
    setValue,
    unregister,
    register,
    clearErrors,
  } = useForm({
    defaultValues: {
      tarrif: null,
      price: null,
      priceItem: [],
      effectiveFromDate: new Date(),
      service: null,
      emrPrice: null,
      emrPriceItem: [],
    },
    mode: "onTouched",
  });

  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  let effectiveFormDateCount = 0;
  const [OpenModal, setOpenModal] = useState(false);
  const watchAllDoctor = watch("allDoctor");
  const [tempBedTypedata, setTempBedTypedata] = useState([]);
  const [openPriceMaster, setOpenPriceMaster] = useState([]);
  const defferedAllDoctorValue = useDeferredValue(watchAllDoctor);

  useEffect(() => {
    if (Array.isArray(bedTypeData)) {
      let temp = bedTypeData.map((item) => {
        return {
          ...item,
          selected: true,
          price: 0,
          emrPrice: 0,
        };
      });
      setTempBedTypedata(temp);
    }
  }, [bedTypeData]);

  console.log("this is fields to unregister useEffect : ", getValues());

  function onChangeCommonCheckBoxValue(value) {
    startTransition(() => {
      let temp = JSON.parse(JSON.stringify(tempBedTypedata));
      temp.forEach((obj) => (obj.selected = value));
      setTempBedTypedata(temp);
    });
  }

  function onChangeCommonPriceValue(value) {
    startTransition(() => {
      if (Number.isNaN(value)) return;
      let temp = tempBedTypedata.length;
      for (let i = 0; i < temp; i++) {
        if (tempBedTypedata[i]["selected"]) {
          setValue(`price-${i}`, value);
        }
      }
    });
  }

  function onChangeCommonEmrPriceValue(value) {
    if (Number.isNaN(value)) return;
    let temp = tempBedTypedata.length;
    for (let i = 0; i < temp; i++) {
      if (tempBedTypedata[i]["selected"]) {
        setValue(`emrPrice-${i}`, value);
      }
    }
  }

  function handleOpenNewPrices(bedTypeId,addOrRemove,index){
    console.log("this is open price master : started")
      if(tempBedTypedata[index].delete) return;
      if(addOrRemove) {
        setOpenPriceMaster([...openPriceMaster, bedTypeId])
      } else {
        setOpenPriceMaster(openPriceMaster.filter(item=>item!==bedTypeId))
      }
  }

  function deleteNewValuesOfBedType(socIndex,newPriceIndex,value){
    let temp = JSON.parse(JSON.stringify(tempBedTypedata));
    temp[socIndex].newPrice[newPriceIndex].deleted = value;
    temp[socIndex].newEmrPrice[newPriceIndex].deleted = value;
    setTempBedTypedata(temp);
  }

  useEffect(() => {
    console.log("this is open price master : ", openPriceMaster);
  },[openPriceMaster])

  const CloseModal = () => {
    setOpenModal(false);
    effectiveFormDateCount = 0;
    dispatch(setSocEditData(null));
    clearErrors();
    let unreigsterFields = [];
    let tempLength = tempBedTypedata.length;
    console.log(
      "this is fields to unregister : ",
      unreigsterFields,
      getValues()
    );
    unregister(unreigsterFields);
    console.log("this is fields to unregistered after  : ", getValues());
    setTempBedTypedata(
      bedTypeData.map((item) => ({
        ...item,
        selected: true,
        price: 0,
        emrPrice: 0,
      }))
    );
    setOpenPriceMaster([]);
    // reset();
    reset({
      tarrif: null,
      commonCheckBox: true,
      price: null,
      effectiveFromDate: new Date(),
      service: null,
      emrPrice: null,
      allDoctor: true,
      doctor: null,
    });

    console.log("this is fields to unregistered after  : ", getValues());
  };

  const onCheckBoxValueChange = (index) => {
    let temp = JSON.parse(JSON.stringify(tempBedTypedata));
    let ref = temp[index];
    ref.selected = !ref.selected;
    setTempBedTypedata(temp);
    if (ref.selected) {
      //* tick was checked
      let allSelected = temp.every((item) => item.selected);
      if (allSelected) {
        setValue("commonCheckBox", true);
      }
    } else {
      //* tick was unchecked
      setTempBedTypedata(temp);
      let atleastOneSelected = temp.some((item) => item.selected);
      if (!atleastOneSelected) {
        setValue("commonCheckBox", false);
      }
    }
  };

  const onPaginationChange = async ({ page, pageSize }) => {
    if (
      page !== paginationModel.page ||
      pageSize !== paginationModel.pageSize
    ) {
      const recentState = structuredClone(paginationModel);
      dispatch(setSocPagination({ page, pageSize }));
      if (page !== recentState.page) {
        // change the page
        const resData = await getSocMasterData(true, page, pageSize);
        if (!resData) {
          dispatch(setSocPagination(recentState));
        }
      } else {
        // change the pageSize
        const resData = await getSocMasterData(true, 0, pageSize);

        if (!resData) {
          dispatch(setSocPagination(recentState));
        }
      }
    }
  };

  var submitData = async (data) => {
    if (editSocData) {
      console.log("this is form data : ", data, tempBedTypedata);
      let deletedBedType = [];
      let editedBedType = [];
      let addedBedType = [];
      let finalData = {};

      console.log("this is form data : ", data);
      let editAndNewTotalLength = 0;
      let deleteLength = 0;
      //* find the first index where to start new added bedTypes
      let firstIndexOfNewBedType = tempBedTypedata.findIndex((obj) => obj.new);
      if (firstIndexOfNewBedType !== -1) {
        addedBedType = tempBedTypedata.slice(firstIndexOfNewBedType);
        let addedBedTypeLength = addedBedType.length;
        let addedBed = [];

        for (let i = 0; i < addedBedTypeLength; i++) {
          if (addedBedType[i].selected) {
            let tempDate = new Date(data[`effectiveFromDate-${firstIndexOfNewBedType + i}`]);
            tempDate.setHours(0, 0, 0, 0);
            addedBed.push({
              id: addedBedType[i]._id, //* here is _id for new added bedType either we use id for old data
              price: data[`price-${firstIndexOfNewBedType + i}`],
              emrPrice: data[`emrPrice-${firstIndexOfNewBedType + i}`],
              effectiveFromDate: tempDate,
            });
          }
        }
        editAndNewTotalLength = addedBed.length;
        finalData.addedBed = JSON.stringify(addedBed);
      }

      //* now start finding the deleted bedTypes
      let filterdTempBedTypeData = tempBedTypedata.filter((obj) => !obj.new);
      let filterdTempBedTypeDataLength = filterdTempBedTypeData.length;
      for (let i = 0; i < filterdTempBedTypeDataLength; i++) {
        if (filterdTempBedTypeData[i].delete) {
          deletedBedType.push({
            priceId: filterdTempBedTypeData[i].priceId,
            emrPriceId: filterdTempBedTypeData[i].emrPriceId,
            priceMasterId: filterdTempBedTypeData[i].priceMasterId,
          });
        }
      }
      deleteLength = deletedBedType.length;
      finalData.deletedBed = JSON.stringify(deletedBedType);
      console.log("this is final data of filterdTempBedTypeData ", filterdTempBedTypeData);
      //* now we are start for edited data
      for (let i = 0; i < filterdTempBedTypeData.length; i++) {
        if (filterdTempBedTypeData[i].delete) continue;

        let tempEffectiveFromDate = new Date(data[`effectiveFromDate-${i}`]);
        console.log("this is edited data 90 before setHours : ", tempEffectiveFromDate);
        tempEffectiveFromDate.setHours(0, 0, 0, 0);
        console.log("this is edited data 90 after setHours : ", tempEffectiveFromDate);
        const deletedNewPrice = filterdTempBedTypeData[i].newPrice.filter((obj)=>obj.deleted);
        const deletedNewEmrPrice = filterdTempBedTypeData[i].newEmrPrice.filter((obj)=>obj.deleted);
        editedBedType.push({
          _id: filterdTempBedTypeData[i].priceId,
          price: data[`price-${i}`],
          effectiveFromDate: tempEffectiveFromDate,
          deletedNewValues: deletedNewPrice,
        });
        editedBedType.push({
          _id: filterdTempBedTypeData[i].emrPriceId,
          price: data[`emrPrice-${i}`],
          effectiveFromDate: tempEffectiveFromDate,
          deletedNewValues: deletedNewEmrPrice,
        });
      }
      editAndNewTotalLength += editedBedType.length;
      console.log("this is final data before json stringify : ", editedBedType)
      console.log("this is final data :  ", JSON.parse(JSON.stringify(editedBedType)));
      finalData.editedBed = JSON.stringify(editedBedType);

      if (editAndNewTotalLength === 0 && deleteLength > 0) {
        toast.error("Please select at least one bed type");
        return;
      }
      finalData.tarrif = data.tarrif._id;
      finalData.service = data.service._id;
      finalData.doctor = data.allDoctor ? null : data?.doctor?._id;
      finalData._id = data._id;
      finalData.id = data.id;

      console.log("this is final data : ", finalData);
      // return;
      let temp = await updateSocMaster(finalData);
      if (temp) {
        CloseModal();
      }
    } else {
      let bedType = [];
      let bedTypeLength = tempBedTypedata.length;
      for (let i = 0; i < bedTypeLength; i++) {
        if (!tempBedTypedata[i].selected) continue;
        bedType.push({
          id: tempBedTypedata[i]._id,
          price: data[`price-${i}`],
          emrPrice: data[`emrPrice-${i}`],
        });
      }

      delete data?._id;
      if (data.allDoctor) {
        delete data.doctor;
      } else {
        delete data.allDoctor;
      }

      console.log("effectFormDate :  ", data);
      let tempDate = data?.effectiveFromDate ? new Date(data.effectiveFromDate) : new Date();
      tempDate.setHours(0, 0, 0, 0);
      let temp = await createSocMaster({
        tarrif: data.tarrif._id,
        service: data.service._id,
        doctor: data?.doctor?._id,
        effectiveFromDate: tempDate,
        bedType: JSON.stringify(bedType),
      });
      if (temp) {
        CloseModal();
      }
    }
  };

  async function setEditDateHandler(data) {
    clearErrors();
    dispatch(setSocEditData(true));
    //* get data
    const resData = await getSocMasterDataById(data._id);
    if (!resData) return;
    console.log("this is params row : ", data);
    reset({
      id: data.id - paginationModel.page * paginationModel.pageSize - 1,
      _id: data._id,
      commonCheckBox: true,
      tarrif: data.tarrif,
      service: data.service,
      doctor: data.doctor,
      allDoctor: data.doctor ? false : true,
      effectiveFromDate: "",
    });

    let tempResBedTypeData = resData.pricesWithBedType;
    if (!Array.isArray(tempResBedTypeData) || tempResBedTypeData.length === 0)
      return;

    //* this is all selected bed type data
    console.log("@this is i want to find  : ", tempResBedTypeData);
    tempResBedTypeData = tempResBedTypeData.map((item, index) => {
      setValue(`price-${index}`, Number(item.prices.currentValue || 0));
      setValue(`emrPrice-${index}`, Number(item.emrPrices.currentValue || 0));
      setValue(
        `effectiveFromDate-${index}`,
        new Date(item.prices.effectiveFromDate)
      );
      return {
        id: item.bedType._id,
        priceId: item.prices._id,
        emrPriceId: item.emrPrices._id,
        priceMasterId: item._id,
        bedName: item.bedType.bedName,
        selected: true,
        delete: false,
        newPrice: item.prices.newValues?.map((obj) => ({
          ...obj,
          date: new Date(obj.date),
          deleted: false,
        })),
        newEmrPrice: item.emrPrices.newValues?.map((obj) => ({
          ...obj,
          date: new Date(obj.date),
          deleted: false,
        })),
      };
    });

    //* this is new bedtypes data
    let unSelectedBedTypes = bedTypeData
      .filter((obj) => !tempResBedTypeData.some((item) => item.id === obj._id))
      .map((item, index) => {
        setValue(`price-${tempResBedTypeData.length + index}`, 0);
        setValue(`emrPrice-${tempResBedTypeData.length + index}`, 0);
        setValue(
          `effectiveFromDate-${tempResBedTypeData.length + index}`,
          new Date()
        );
        return {
          ...item,
          selected: false,
          price: 0,
          emrPrice: 0,
          new: true,
        };
      });

    tempResBedTypeData = tempResBedTypeData.concat(unSelectedBedTypes);
    console.log("#this is i want to find : ", tempResBedTypeData);
    setTempBedTypedata(tempResBedTypeData);
    setOpenModal(true);
  }

  function deleteBedType(index, value) {
    let temp = JSON.parse(JSON.stringify(tempBedTypedata));
    temp[index].delete = value;
    setOpenPriceMaster(openPriceMaster.filter(item=>item!==temp[index].id))
    setTempBedTypedata(temp);
  }

  let gridWidth = editSocData ? 3 : 4;
  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    { field: "_id", headerName: "", width: "0" },
    {
      field: "tarrif",
      headerName: "Tarrif",
      flex: 1,
      renderCell: (params) => params.row?.tarrif?.tariffName,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "service",
      headerName: "Service",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row?.service?.serviceName,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "servicType",
      headerName: "Service Type",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.row?.service?.serviceType?.serviceTypeName,
    },
    {
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.row?.doctor?.userName || "All Doctor",
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          {
            <div
              className="btn btn-sm"
              onClick={() => setEditDateHandler(params.row)}>
              <CustomIconButton />
            </div>
          }
        </>
      ),
    },
  ];

  const setRows = (data) => {
    var id = paginationModel.page * paginationModel.pageSize;
    var array = [];
    data?.forEach((element) => {
      let thisData = {
        id: ++id,
        _id: element?._id,
        tarrif: element?.tarrif,
        service: element?.service,
        servicType: element?.service?.serviceType,
        doctor: element?.doctor,
      };
      array.push(thisData);
    });
    return array;
  };

  const rowData = useMemo(() => {
    if (
      socData !== undefined &&
      Array.isArray(socData) &&
      listLoading === false
    ) {
      return setRows(socData);
    }
  }, [socData, listLoading]);

  return (
    <>
      <AddEditModal
        maxWidth="lg"
        handleClose={CloseModal}
        handleSubmit={handleSubmit(submitData)}
        open={OpenModal}
        modalTitle={editSocData ? `Update Soc` : `Add Soc`}
        isEdit={!!editSocData}
        Loading={socLoading}>
        <Box component="form" onSubmit={handleSubmit(submitData)} p={1}>
          <Grid
            container
            spacing={{ md: 3, xs: 2 }}
            // columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-between"
            alignItems="center">
            <Grid xs={12} sm={4}>
              <Controller
                name="service"
                control={control}
                rules={{ required: "service is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select service "}
                      hasError={error}
                      focused={true}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      url={"admin/billing/serviceMaster"}
                      getOptionLabel={(option) =>
                        `${option?.serviceName} (${option?.serviceType?.serviceTypeName})`
                      }
                      filterOnActive={true}
                    />
                  );
                }}
              />
              {errors.service && (
                <Typography variant="caption" color="error">
                  Service is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="tarrif"
                control={control}
                rules={{ required: "tarrif is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select tarrif "}
                      hasError={error}
                      focused={true}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      url={"admin/addMaster/tarrifMaster"}
                      getOptionLabel={(option) => option?.tariffName}
                      filterOnActive={true}
                    />
                  );
                }}
              />
              {errors.tarrif && (
                <Typography variant="caption" color="error">
                  Tarrif is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="allDoctor"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <FormControlLabel
                      label="All Doctor"
                      control={
                        <Checkbox
                          checked={value}
                          defaultValue={value}
                          ref={ref}
                          onChange={onChange}
                        />
                      }
                    />
                  );
                }}></Controller>
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="doctor"
                rules={{
                  required: {
                    value: !defferedAllDoctorValue,
                    message: "doctor is required",
                  },
                }}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      key={"doctorSocMaster"}
                      lable={"Select Doctor"}
                      value={value}
                      disable={defferedAllDoctorValue}
                      getOptionLabel={(option) =>
                        option?.userName
                          ? ` ${option?.userName} / ${
                              option?.speciality?.speciality || ""
                            }`
                          : "All Doctor"
                      }
                      url={`admin/userMaster/user/doctor`}
                      inputRef={ref}
                      hasError={error}
                    />
                  );
                }}></Controller>
              {errors.doctor && (
                <Typography variant="caption" color="error">
                  {errors.doctor.message}
                </Typography>
              )}
            </Grid>

            {!editSocData && (
              <Grid xs={12} sm={4}>
                <CustomDatePickerField
                  name={"effectiveFromDate"}
                  control={control}
                  format="DD/MM/YYYY"
                  label={"Effective From Date"}
                  minDate={new Date()}
                />
              </Grid>
            )}

            <Grid sm={4} xs={0}></Grid>

            <Grid xs={12}>
              <Divider>
                {" "}
                <Chip label="Pricing" size="small" />{" "}
              </Divider>
            </Grid>

            <Grid
              container
              justifyContent="center"
              alignItems={"center"}
              xs={12}
              sm={gridWidth}>
              <Controller
                name="commonCheckBox"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref } = field;
                  return (
                    <FormControlLabel
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "22px",
                        },
                      }}
                      label="Bed Types"
                      control={
                        <Checkbox
                          checked={value}
                          size="medium"
                          ref={ref}
                          onChange={(e) => {
                            onChange(e);
                            onChangeCommonCheckBoxValue(e.target.checked);
                          }}
                        />
                      }
                    />
                  );
                }}
              />
            </Grid>

            <Grid xs={12} sm={gridWidth}>
              <CustomTextInputField
                type="number"
                name={"price"}
                onChange={onChangeCommonPriceValue}
                InputPropsText={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                control={control}
                onPaste={(e) => {
                  if (isNaN(e.clipboardData.getData("text")))
                    e.preventDefault();
                }}
                onKeyDown={(e) => {
                  if (
                    e.key == "e" ||
                    e.key == "E" ||
                    e.key == "+" ||
                    e.key == "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                label={"Price"}
                rules={{
                  // valueAsNumber: true,
                  min: { value: 0, message: "min value 0 is required" },
                }}
              />
            </Grid>

            <Grid xs={12} sm={gridWidth}>
              <CustomTextInputField
                type="number"
                name={"emrPrice"}
                control={control}
                onChange={onChangeCommonEmrPriceValue}
                onPaste={(e) => {
                  if (isNaN(e.clipboardData.getData("text")))
                    e.preventDefault();
                }}
                onKeyDown={(e) => {
                  if (
                    e.key == "e" ||
                    e.key == "E" ||
                    e.key == "+" ||
                    e.key == "-"
                  ) {
                    e.preventDefault();
                  }
                }}
                label={"Emr Price"}
                InputPropsText={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                rules={{
                  // valueAsNumber: true,
                  min: { value: 0, message: "min value 0 is required" },
                }}
              />
            </Grid>

            {editSocData && (
              <Grid xs={12} sm={gridWidth}>
                <CustomDatePickerField
                  name={"effectiveFromDate"}
                  control={control}
                  format="DD/MM/YYYY"
                  label={"Effective From Date"}
                  minDate={new Date()}
                />
              </Grid>
            )}

            <Grid xs={12}>
              <Divider></Divider>
            </Grid>

            {tempBedTypedata.length > 0 ? (
              tempBedTypedata.map((item, index) => {
                let newPriceVar =
                  editSocData &&
                  Array.isArray(item.newPrice) &&
                  item.newPrice.length > 0 &&
                  openPriceMaster.includes(item.id);
                return (
                  <Grid container xs={12} key={index}>
                    <Grid
                      container
                      alignItems={"center"}
                      xs={12}
                      sm={editSocData ? 2 : 4}>
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "22px",
                          },
                        }}
                        label={item.bedName}
                        control={
                          <Checkbox
                            checked={item.selected}
                            disabled={
                              item.delete ||
                              (editSocData && !item.hasOwnProperty("new"))
                            }
                            size="medium"
                            onChange={() => onCheckBoxValueChange(index)}
                          />
                        }
                      />
                    </Grid>

                    <Grid xs={12} sm={gridWidth}>
                      <CustomTextInputField
                        type="number"
                        name={`price-${index}`}
                        disable={!item.selected || item.delete}
                        InputPropsText={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CurrencyRupeeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        control={control}
                        onPaste={(e) => {
                          if (isNaN(e.clipboardData.getData("text")))
                            e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key == "e" ||
                            e.key == "E" ||
                            e.key == "+" ||
                            e.key == "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        label={`${item.bedName} Price`}
                        rules={{
                          // valueAsNumber: true,
                          required: {
                            value: true,
                            message: `${item.bedName} price is required`,
                          },
                          // min: { value: 0, message: "min value 0 is required" },
                        }}
                      />
                    </Grid>

                    <Grid xs={12} sm={gridWidth}>
                      <CustomTextInputField
                        type="number"
                        name={`emrPrice-${index}`}
                        disable={!item.selected || item.delete}
                        InputPropsText={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CurrencyRupeeIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        control={control}
                        onPaste={(e) => {
                          if (isNaN(e.clipboardData.getData("text")))
                            e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key == "e" ||
                            e.key == "E" ||
                            e.key == "+" ||
                            e.key == "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        label={`${item.bedName} Emr Price`}
                        rules={{
                          // valueAsNumber: true,
                          required: {
                            value: true,
                            message: `${item.bedName} emr price is required`,
                          },
                          min: { value: 0, message: "min value 0 is required" },
                        }}
                      />
                    </Grid>
                    {/* {console.log(
                      "price- ",
                      getValues()
                    )} */}
                    {editSocData && (
                      <Grid xs={12} sm={gridWidth}>
                        <CustomDatePickerField
                          name={`effectiveFromDate-${index}`}
                          control={control}
                          format="DD/MM/YYYY"
                          label={`${item.bedName} Effective From Date`}
                          disable={!item.selected || item.delete}
                          minDate={new Date()}
                        />
                      </Grid>
                    )}
                    {editSocData && (
                      <Grid
                        xs={12}
                        sm={1}
                        container
                        justifyContent={"center"}
                        alignItems={"center"}
                        style={{ cursor: "pointer" }}>
                        {item.hasOwnProperty("delete") &&
                          (item.delete ? (
                            <UndoIcon
                              fontSize="medium"
                              style={{ color: "#2e7d32" }}
                              onClick={() => deleteBedType(index, false)}
                            />
                          ) : (
                            <DeleteForeverIcon
                              onClick={() => deleteBedType(index, true)}
                              fontSize="medium"
                              style={{ color: "#e91e63" }}
                            />
                          ))}
                        {Array.isArray(item.newPrice) &&
                        item.newPrice.length > 0 ? (
                          openPriceMaster.includes(item.id) ? (
                            // handleOpenNewPrices(item.id,true)
                              <ArrowDropUpRoundedIcon
                              onClick={()=>handleOpenNewPrices(item.id,false,index)}
                              style={{ fontSize: "40px",color: item.delete ? '#888888' : 'black' }}
                              />
                              ) : (
                                <ArrowDropDownRoundedIcon
                                onClick={()=>handleOpenNewPrices(item.id,true,index)}
                                style={{ fontSize: "40px",color: item.delete ? '#888888' : 'black' }}
                              />
                          )
                        ) : (
                          <ArrowDropUpRoundedIcon
                            style={{ fontSize: "40px", opacity: 0 }}
                          />
                        )}
                      </Grid>
                    )}
                    <Grid
                     container
                     justifyContent="center"
                     alignItems={"center"}
                     xs={12}
                      style={{
                        height: newPriceVar ? `${84*item.newPrice.length+30}px` : 0,
                        overflow: newPriceVar ? "auto" : "hidden",
                        transition: "height opacity",
                        transitionDuration: "0.5s",
                        opacity : newPriceVar ? 1 : 0,
                      }}>
                      {Array.isArray(item.newPrice) &&
                        item.newPrice.map((newPriceObj, index_newPrice) => {
                          console.log("this is new price obj ; ", newPriceObj);
                          return (
                            <Grid
                              xs={12}
                              container
                              key={newPriceObj.price + index_newPrice}>
                              <Grid xs={0} sm={2}></Grid>
                              <Grid xs={12} sm={gridWidth}>
                                <CustomTextInputFieldWithoutController
                                  type="number"
                                  disable={true}
                                  value={item.newPrice[index_newPrice].price}
                                  InputPropsText={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <CurrencyRupeeIcon fontSize="small" />
                                      </InputAdornment>
                                    ),
                                  }}
                                  label={`${item.bedName} Price`}
                                />
                              </Grid>
                              <Grid xs={12} sm={gridWidth}>
                                <CustomTextInputFieldWithoutController
                                  type="number"
                                  value={item.newEmrPrice[index_newPrice].price}
                                  disable={true}
                                  InputPropsText={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <CurrencyRupeeIcon fontSize="small" />
                                      </InputAdornment>
                                    ),
                                  }}
                                  label={`${item.bedName} Emr Price`}
                                />
                              </Grid>
                              <Grid xs={12} sm={gridWidth}>
                                <CustomDatePickerFieldWithoutController
                                  value={newPriceObj.date}
                                  format="DD/MM/YYYY"
                                  label={`${item.bedName} Effective From Date`}
                                  disable={true}
                                />
                              </Grid>
                              <Grid
                                xs={12}
                                sm={1}
                                container
                                justifyContent={"center"}
                                alignItems={"center"}
                                style={{ cursor: "pointer" }}>
                                {newPriceObj.deleted ? (
                                    <UndoIcon
                                      fontSize="medium"
                                      style={{ color: "#2e7d32" }}
                                      onClick={() =>
                                        deleteNewValuesOfBedType(index,index_newPrice,false)
                                      }
                                    />
                                  ) : (
                                    <>
                                      <DeleteForeverIcon
                                      onClick={() => deleteNewValuesOfBedType(index,index_newPrice,true)}
                                      fontSize="medium"
                                      style={{ color: "#e91e63" }}
                                    />
                                    </>
                                  )}
                                  <ArrowDropUpRoundedIcon
                                    style={{ fontSize: "40px", opacity: 0 }}
                                  />
                              </Grid>
                            </Grid>
                          );
                        })}
                    </Grid>
                    {console.log("this is items : ", item)}
                  </Grid>
                );
              })
            ) : (
              <EmptyData />
            )}
          </Grid>
        </Box>
      </AddEditModal>

      <TableMainBox
        title={"Soc Master"}
        buttonText={"Add Soc"}
        onClick={() => {
          reset({
            commonCheckBox: true,
            allDoctor: true,
            effectiveFromDate: new Date(),
          });
          setOpenModal(true);
          clearErrors();
        }}>
        {listLoading ? (
          <>
            <LinearProgress />
            <TableSkeleton />
          </>
        ) : Array.isArray(rowData) && rowData.length > 0 ? (
          <CommonTable
            columns={columns}
            count={socCount}
            paginationModel={paginationModel}
            rowData={rowData}
            onPaginationChange={onPaginationChange}
            activeInActiveNeeded={false}
          />
        ) : (
          <EmptyData />
        )}
      </TableMainBox>
    </>
  );
}

export default SocMaster;
