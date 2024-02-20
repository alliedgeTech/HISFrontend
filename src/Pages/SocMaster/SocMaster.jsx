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
    clearErrors,
  } = useForm({
    defaultValues: {
      tarrif: null,
      price: null,
      priceItem:[],
      effectiveFromDate: new Date(),
      service: null,
      emrPrice: null,
      emrPriceItem:[],
      effectiveFromDateItem:[]
    },
    mode: "onTouched",
  });

  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();
  const [OpenModal, setOpenModal] = useState(false);
  const watchAllDoctor = watch("allDoctor");
  const [tempBedTypedata, setTempBedTypedata] = useState([]);
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

  console.log("this is fields to unregister useEffect : ",getValues())

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
          setValue(`priceItem.${i}`, value);
        }
      }
    });
  }

  function onChangeCommonEmrPriceValue(value) {
    if (Number.isNaN(value)) return;
    let temp = tempBedTypedata.length;
    for (let i = 0; i < temp; i++) {
      if (tempBedTypedata[i]["selected"]) {
        setValue(`emrPriceItem.${i}`, value);
      }
    }
  }

  const CloseModal = () => {
    setOpenModal(false);
    dispatch(setSocEditData(null));
    clearErrors();
    let tempDatalength = tempBedTypedata.length;
    setTempBedTypedata(
      bedTypeData.map((item) => ({
        ...item,
        selected: true,
        price: 0,
        emrPrice: 0,
      }))
      );
      reset({
        tarrif: null,
        commonCheckBox: true,
        priceItem:[],
        price: null,
        effectiveFromDateItem:[],
        effectiveFromDate: new Date(),
        service: null,
        emrPriceItem:[],
        emrPrice: null,
        allDoctor: true,
        doctor: null,
      });
      for(let i=0;i<tempDatalength;i++) {
          setValue(`priceItem.${i}`,null);
          setValue(`emrPriceItem.${i}`,null);
          setValue(`effectiveFromDateItem.${i}`,undefined);
      }

    };
    console.log("this is fields to unregistered after  : ",getValues());

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
      let deletedBedType = [];
      let editedBedType = [];
      let addedBedType = [];

      console.log("this is form data : ",data);

      //* find the first index where to start new added bedTypes
      let firstIndexOfNewBedType = tempBedTypedata.findIndex((obj) => obj.new);
      if (firstIndexOfNewBedType !== -1) {
        addedBedType = tempBedTypedata.slice(firstIndexOfNewBedType).filter((obj) => obj.selected);
        console.log("added bed type : ", addedBedType);
      }
      return;
      //*

      let temp = await updateSocMaster(data);
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
          price: data[`priceItem.${i}`],
          emrPrice: data[`emrPriceItem.${i}`],
        });
      }

      delete data?._id;
      if (data.allDoctor) {
        delete data.doctor;
      } else {
        delete data.allDoctor;
      }

      let temp = await createSocMaster({
        tarrif: data.tarrif._id,
        service: data.service._id,
        doctor: data?.doctor?._id,
        effectiveFromDate: data?.effectiveFromDate,
        bedType: JSON.stringify(bedType),
      });
      if (temp) {
        CloseModal();
      }
    }
  };

  async function setEditDateHandler(data) {
    console.log("debugging@ : ",getValues());
    clearErrors();
    dispatch(setSocEditData(true));
    //* get data
    const resData = await getSocMasterDataById(data._id);
    if (!resData) return;
    console.log("this is params row : ",data);
    reset({
      id: data.id,
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
    tempResBedTypeData = tempResBedTypeData.map((item, index) => {
      setValue(`priceItem.${index}`, Number(item.prices.currentValue || 0));
      setValue(`emrPriceItem.${index}`, Number(item.emrPrices.currentValue || 0));
      setValue(
        `effectiveFromDateItem.${index}`,
        new Date(item.prices.effectiveFromDate)
      );
      return {
        id: item.bedType._id,
        priceId: item.prices._id,
        emrPriceId: item.emrPrices._id,
        bedName: item.bedType.bedName,
        selected: true,
        delete: false,
      };
    });

    //* this is new bedtypes data
    let unSelectedBedTypes = bedTypeData
      .filter((obj) => !tempResBedTypeData.some((item) => item.id === obj._id))
      .map((item, index) => {
        setValue(`priceItem.${tempResBedTypeData.length + index}`, 0);
        setValue(`emrPriceItem.${tempResBedTypeData.length + index}`, 0);
        return {
          ...item,
          selected: false,
          price: 0,
          emrPrice: 0,
          new: true,
        };
      });

    tempResBedTypeData = tempResBedTypeData.concat(unSelectedBedTypes);
    setTempBedTypedata(tempResBedTypeData);
    setOpenModal(true);
  }

  function deleteBedType(index, value) {
    let temp = JSON.parse(JSON.stringify(tempBedTypedata));
    temp[index].delete = value;
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
                  minDate={!editSocData && new Date()}
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
                  valueAsNumber: true,
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
                  valueAsNumber: true,
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
                />
              </Grid>
            )}

            <Grid xs={12}>
              <Divider></Divider>
            </Grid>

            {tempBedTypedata.length > 0 ? (
              tempBedTypedata.map((item, index) => {
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
                            disabled={item.delete}
                            size="medium"
                            onChange={() => onCheckBoxValueChange(index)}
                          />
                        }
                      />
                    </Grid>

                    <Grid xs={12} sm={gridWidth}>
                      <CustomTextInputField
                        type="number"
                        name={`priceItem.${index}`}   
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
                          valueAsNumber: true,
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
                        name={`emrPriceItem.${index}`}
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
                          valueAsNumber: true,
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
                          name={`effectiveFromDateItem.${index}`}
                          control={control}
                          format="DD/MM/YYYY"
                          label={`${item.bedName} Effective From Date`}
                          disable={!item.selected || item.delete}
                          minDate={editSocData ? undefined : new Date()}
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
                      </Grid>
                    )}
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
          console.log("debugging@ : ",getValues());
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
