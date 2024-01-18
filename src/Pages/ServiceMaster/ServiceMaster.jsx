import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, LinearProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { useServiceData } from "../../services/Adminastrator/ServiceMaster";
import {
  setEditServiceData,
  setServicePagination,
} from "../../slices/service.slice";
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import EmptyData from "../../Components/NoData/EmptyData";

function ServiceMaster() {
  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
  } = useForm({
    defaultValues: {
      serviceType: null,
      department: null,
      serviceName: "",
      grade: null,
      isActive: "true",
      gradePeriod: null,
      isLogical: null,
      isEditable: null,
      gender: null,
      ipOp: "both",
      doctorNameRequired: null,
      remarks: "",
    },
    mode: "onTouched",
  });

const { listLoading, createService, getServiceData, updateServiceData } =
    useServiceData();
  const [OpenModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const {
    serviceData,
    serviceLoading,
    editServiceData,
    serviceCount,
    servicePagination:paginationModel,
  } = useSelector((state) => state.service);

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const CloseModal = () => {
    setOpenModal(false);
    dispatch(setEditServiceData(null));
    clearErrors();
    reset({
      serviceType: null,
      department: null,
      serviceName: "",
      grade: null,
      isActive: "true",
      gradePeriod: null,
      isLogical: null,
      isEditable: null,
      gender: null,
      ipOp: "both",
      doctorNameRequired: null,
      remarks: "",
    });
  };

  const onPaginationChange = async ({ page, pageSize }) => {
    if (
      page !== paginationModel.page ||
      pageSize !== paginationModel.pageSize
    ) {
      const recentState = structuredClone(paginationModel);
      dispatch(setServicePagination({ page, pageSize }));
      if (page !== paginationModel.page) {
        // change the page
        const resData = await getServiceData(true, page, pageSize);
        if (!resData) {
          dispatch(setServicePagination(recentState));
        }
      } else {
        // change the pageSize
        const resData = await getServiceData(true, 0, pageSize);

        if (!resData) {
          dispatch(setServicePagination(recentState));
        }
      }
    }
  };

  var submitData = async (data) => {
    console.log(" form data", data);

    if (editServiceData) {
      let temp = await updateServiceData(
        data,
        paginationModel.page,
        paginationModel.pageSize
      );
      if (temp) {
        dispatch(setEditServiceData(null));
        setOpenModal(false);
      }
    } else {
      delete data?._id;
      let temp = await createService(
        data,
        paginationModel.page,
        paginationModel.pageSize
      );
      if (temp) {
        CloseModal();
        setOpenModal(false);
        dispatch(setEditServiceData(null));
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 60,
      headerAlign: 'center',align: 'center'
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "serviceType", headerName: "Service Type", flex: 1,renderCell:(params) => params.row?.serviceType?.serviceTypeName,minWidth:150,headerAlign: 'center',align: 'center' },
    { field: "department", headerName: "Department", flex: 1,minWidth:150, renderCell:(params) => params.row?.department?.department,headerAlign: 'center',align: 'center' },
    { field: "serviceName", headerName: "Service", flex: 1,minWidth:150,headerAlign: 'center',align: 'center' },
    { field: "grade", headerName: "Grade", flex: 1,minWidth:100,headerAlign: 'center',align: 'center' },
    { field: "gradePeriod", headerName: "Grade Period", flex: 1,headerAlign: 'center',align: 'center',minWidth:60 },
    { field: "isLogical", headerName: "Is Logical", flex: 1,headerAlign: 'center',align: 'center',minWidth:60 },
    { field: "isEditable", headerName: "Is Editable", flex: 1,headerAlign: 'center',align: 'center',minWidth:60 },
    { field: "gender", headerName: "Gender", flex: 1,headerAlign: 'center',align: 'center',minWidth:100 },
    { field: "ipOp", headerName: "Ip/Op", flex: 1,headerAlign: 'center',align: 'center',minWidth:70 },
    { field: "remarks", headerName: "Remarks", flex: 1,headerAlign: 'center',align: 'center',minWidth:150 },
    {
      field: "isActive",
      headerName: "Is Active",
      headerAlign: 'center',align: 'center',
      flex: 1,
      renderCell: (params) => {
        return (
          <IOSSwitch
            checked={params.row.isActive}
            onChange={(e) =>
              updateServiceData(
                {
                  _id: params.row?._id,
                  isActive: e.target.checked,
                  id:
                    params.row.id -
                    paginationModel.page * paginationModel.pageSize -
                    1,
                },
                paginationModel.page,
                paginationModel.pageSize
              )
            }></IOSSwitch>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: 'center',align: 'center',
      sortable: false,
      renderCell: (params) => (
        <>
          {
            <div
              className="btn btn-sm"
              onClick={() => {
                clearErrors();
                dispatch(setEditServiceData(true));
                setOpenModal(true);
                reset({
                  ...params.row,
                  id:
                    params.row.id -
                    paginationModel.page * paginationModel.pageSize -
                    1,
                  isActive: params.row.isActive.toString(),
                  isLogical: params.row?.isLogical?.toString(),
                  isEditable: params.row?.isEditable?.toString(),
                  doctorNameRequired:
                    params.row?.doctorNameRequired?.toString(),
                });
              }}>
              <CustomIconButton />
            </div>
          }
          cd
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
        serviceType: element?.serviceType,
        department: element?.department,
        serviceName: element?.serviceName,
        grade: element?.grade,
        gradePeriod: element?.gradePeriod,
        isLogical: element?.isLogical,
        isEditable: element?.isEditable,
        gender: element?.gender,
        ipOp: element?.ipOp,
        doctorNameRequired: element?.doctorNameRequired,
        isActive: element?.isActive,
        remarks: element?.remarks,
      };
      array.push(thisData);
    });
    return array;
  };

  const rowData = useMemo(() => {
    if (
      serviceData !== undefined &&
      Array.isArray(serviceData) &&
      listLoading === false
    ) {
      return setRows(serviceData);
    }
  }, [serviceData, listLoading]);

  return (
    <>
      <AddEditModal
        maxWidth="lg"
        handleClose={CloseModal}
        handleSubmit={handleSubmit(submitData)}
        open={OpenModal}
        modalTitle={
          editServiceData ? `Update ServiceType` : `Add ServiceType`
        }
        isEdit={!!editServiceData}
        Loading={serviceLoading}>
        <Box component="form" onSubmit={handleSubmit(submitData)} p={1}>
          <Grid
            container
            spacing={{ md: 3, xs: 2 }}
            // columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-between"
            alignItems="center">
            <Grid xs={12} sm={4}>
              <Controller
                name="serviceType"
                control={control}
                rules={{ required: "service type is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select service Type"}
                      hasError={error}
                      focused={true}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      url={"admin/serviceTypeMaster"}
                      getOptionLabel={(option) => option.serviceTypeName}
                      filterOnActive={true}
                    />
                  );
                }}
              />
              {errors.serviceType && (
                <Typography variant="caption" color="error">
                  Service Type is required
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select Department"}
                      value={value}
                      hasError={error}
                      onBlur={onBlur}
                      getOptionLabel={(option) => option?.department}
                      url={"admin/addMaster/getdepartment"}
                      filterOnActive={true}
                      inputRef={ref}
                    />
                  );
                }}></Controller>
              {errors.department && (
                <Typography variant="caption" color="error">
                  Department is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <CustomTextInputField
                name={"serviceName"}
                control={control}
                label={"Service Name"}
                rules={{
                  required: {
                    value: true,
                    message: "service name is required",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="grade"
                control={control}
                rules={{ required: "grade is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select Grade"}
                      value={value}
                      hasError={error}
                      onBlur={onBlur}
                      getOptionLabel={(option) => option}
                      options={[
                        "gradeI",
                        "gradeII",
                        "gradeIII",
                        "gradeIV",
                        "gradeV",
                        "gradeVI",
                        "gradeVII",
                        "gradeVIII",
                        "gradeIX",
                        "NA",
                      ]}
                      inputRef={ref}
                    />
                  );
                }}></Controller>
              {errors.grade && (
                <Typography variant="caption" color="error">
                  Department is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="isActive"
                control={control}
                rules={{ required: "isActive is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select isActive"}
                      hasError={error}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      options={["true", "false"]}
                      getOptionLabel={(option) =>
                        option === "true" ? "yes" : "no"
                      }
                    />
                  );
                }}
              />
              {errors.isActive && (
                <Typography variant="caption" color="error">
                  IsActive is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <CustomTextInputField
                type="number"
                name={"gradePeriod"}
                control={control}
                label={"grade period"}
                rules={{
                  required: {
                    value: true,
                    message: "grade period is required",
                  },
                }}
              />
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="isLogical"
                control={control}
                rules={{ required: "is logical is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select isLogical"}
                      hasError={error}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      options={["true", "false"]}
                      getOptionLabel={(option) =>
                        option === "true" ? "yes" : "no"
                      }
                    />
                  );
                }}
              />
              {errors.isLogical && (
                <Typography variant="caption" color="error">
                  isLogical is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="isEditable"
                control={control}
                rules={{ required: "is editable is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select isEditable"}
                      hasError={error}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      options={["true", "false"]}
                      getOptionLabel={(option) =>
                        option === "true" ? "yes" : "no"
                      }
                    />
                  );
                }}
              />
              {errors.isEditable && (
                <Typography variant="caption" color="error">
                  isEditable is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} md={4}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "gender is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select Gender"}
                      onBlur={onBlur}
                      hasError={error}
                      value={value}
                      getOptionLabel={(option) => option}
                      options={["male", "female", "other", "all"]}
                      inputRef={ref}
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
              <Controller
                name="ipOp"
                control={control}
                rules={{ required: "ipOp is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select IpOp"}
                      hasError={error}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      options={["both", "ip", "op"]}
                      getOptionLabel={(option) => option}
                    />
                  );
                }}
              />
              {errors.ipOp && (
                <Typography variant="caption" color="error">
                  IpOp is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <Controller
                name="doctorNameRequired"
                control={control}
                rules={{ required: "doctorNameRequired is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select DoctorNameRequired"}
                      hasError={error}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      options={["true", "false"]}
                      getOptionLabel={(option) =>
                        option === "true" ? "yes" : "no"
                      }
                    />
                  );
                }}
              />
              {errors.doctorNameRequired && (
                <Typography variant="caption" color="error">
                  doctorNameRequired is required
                </Typography>
              )}
            </Grid>

            <Grid xs={12} sm={4}>
              <CustomTextInputField
                name={"remarks"}
                control={control}
                label={"Remarks"}
                rules={{
                  required: { value: true, message: "remarks is required" },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </AddEditModal>

      <TableMainBox
           title={"Service Master"}
           buttonText={"Add Service"}
           onClick={() => {setOpenModal(true);clearErrors();}}
        >
            {
                listLoading ? <><LinearProgress /><TableSkeleton/></> : Array.isArray(rowData) && rowData.length > 0 ? (
                    <DataGrid
                    style={{maxHeight:"calc(100vh - 173px)"}}
                    initialState={{ pagination: { paginationModel: { pageSize: paginationModel.pageSize,page:paginationModel.page } } , 
                    columns: {
                      columnVisibilityModel: {
                        // Hide columns status and traderName, the other columns will remain visible
                        _id: false,
                      },
                    },
                  
                  }}
                    sx={{
                        "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                            outline: "none !important",
                         },
                      '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
                      '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
                      '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
                    }}
                      disableRowSelectionOnClick={true}
                      columns={columns}
                      rows={rowData}
                      slots={{ toolbar: GridToolbar }}
                      getRowHeight={(_data) => 'auto'}  
                      getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
                      classes={{cellContent:"cellContent"}}
                      paginationModel={paginationModel}
                      onPaginationModelChange={(data) => onPaginationChange(data)}
                      rowCount={serviceCount}
                      pagination
                      pageSizeOptions={[10,30,50,100]}
                      paginationMode="server"
                    />
                  ) : (
                    <EmptyData />
                  )
            }

    </TableMainBox>
    </>
  );
}

export default ServiceMaster;
