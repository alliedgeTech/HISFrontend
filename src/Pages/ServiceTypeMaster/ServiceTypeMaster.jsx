import React, { useEffect, useMemo, useState } from "react";
import { useForm,Controller } from "react-hook-form";
import { useServiceTypeData } from "../../services/Adminastrator/ServiceTypeMaster";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditServiceTypeData,
  setServiceTypePagination,
} from "../../slices/servicetype.slice";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import { Box, LinearProgress, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import EmptyData from "../../Components/NoData/EmptyData";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";

function ServiceTypeMaster() {
  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
  } = useForm({
    defaultValues: {
      serviceTypeName: "",
      ipOp: 'both',
      isActive: "true",
    },
    mode: "onTouched",
  });

  const {
    ListLoading,
    createServiceType,
    getServiceTypeData,
    updateServiceTypeData,
  } = useServiceTypeData();
  const [OpenModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const {
    serviceTypeData,
    serviceTypeLoading,
    editServiceTypeData,
    serviceTypeCount,
    serviceTypePagination: paginationModel,
  } = useSelector((state) => state.serviceType);

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
    dispatch(setEditServiceTypeData(null));
    clearErrors();
    reset({
      serviceTypeName: "",
      ipOp: 'both',
      isActive: "true",
    });
  };

  const onPaginationChange = async ({ page, pageSize }) => {
    if (
      page !== paginationModel.page ||
      pageSize !== paginationModel.pageSize
    ) {
      const recentState = structuredClone(paginationModel);
      dispatch(setServiceTypePagination({ page, pageSize }));
      if (page !== paginationModel.page) {
        // change the page
        const resData = await getServiceTypeData(true, page, pageSize);
        if (!resData) {
          dispatch(setServiceTypePagination(recentState));
        }
      } else {
        // change the pageSize
        const resData = await getServiceTypeData(true, 0, pageSize);

        if (!resData) {
          dispatch(setServiceTypePagination(recentState));
        }
      }
    }
  };

  var submitData = async (data) => {
    console.log(" form data", data);

    if (editServiceTypeData) {
      let temp = await updateServiceTypeData(
        data,
        paginationModel.page,
        paginationModel.pageSize
      );
      if (temp) {
        CloseModal();
      }
    } else {
      delete data?._id;
      let temp = await createServiceType(
        data,
        paginationModel.page,
        paginationModel.pageSize
      );
      if (temp) {
        CloseModal();
      }
    }
  };

  const columns = [
    {
        field: "id",
        headerName: "ID",
    },
    { field: "_id", headerName: "", width: "0" },
    { field: "serviceTypeName", headerName: "Service Type", flex:1 },
    { field:"ipOp",headerName:'Ip/Op',flex:1 },
    { field: "isActive", headerName: "Is Active", flex:1 ,
    renderCell : (params) => {
    return  <IOSSwitch checked={params.row.isActive} onChange={(e)=>updateServiceTypeData({ _id:params.row?._id,isActive:e.target.checked,id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1},paginationModel.page,paginationModel.pageSize)}></IOSSwitch>  
    }
    },
    {
        field: "actions",
        headerName: "Actions",
        sortable:false,
        renderCell: (params) => (
        <>
            <div
            className="btn btn-sm"
            onClick={() => {clearErrors();dispatch(setEditServiceTypeData(true));setOpenModal(true);reset({
                ...params.row,id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1,isActive:params.row?.isActive?.toString() })}} 
            >
                 <CustomIconButton />
            </div>
        </>
        ),
    },
  ];

    const setRows = (data) => {
        var id = paginationModel.page*paginationModel.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    _id: element?._id,
                    serviceTypeName:element?.serviceTypeName,
                    ipOp:element?.ipOp,
                    isActive:element?.isActive
                };

                array.push(thisData);
        });
        return array;
    };


    const rowData = useMemo(() => {
        if( serviceTypeData !== undefined && Array.isArray(serviceTypeData) && ListLoading === false){
          return setRows(serviceTypeData)
        }
      },[serviceTypeData,ListLoading])

  return <>
     <AddEditModal
    maxWidth="lg"
    handleClose={CloseModal}
    handleSubmit={handleSubmit(submitData)}
    open={OpenModal}
    modalTitle={editServiceTypeData ? `Update ServiceType` : `Add ServiceType`}
    isEdit={!!editServiceTypeData}
    Loading={serviceTypeLoading}
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
                    <CustomTextInputField 
                        name={"serviceTypeName"}
                        control={control}
                        label={"Service Type"}
                        focused={true}
                        rules={{required:{value:true,message:"service type is required"}}}
                        /> 
                 </Grid>

                 <Grid xs={12} sm={4}>
                    <Controller
                    name="ipOp"
                    control={control}
                    rules={{ required: 'ipOp is required' }}
                    render={({ field,fieldState: { error } }) => {
                        const {onChange,value,ref,onBlur} = field; 
                    return <CustomAutoCompelete 
                    onChange={onChange}
                    lable={"Select IpOp"}
                    hasError={error}
                    value={value}
                    onBlur={onBlur}
                    inputRef={ref}
                    options={["both","ip","op"]}
                    getOptionLabel={(option)=> option}
                    /> 
                    }}
                    />
                  {
                     errors.ipOp && <Typography variant="caption" color="error">IpOp is required</Typography> 
                  }
                </Grid>

                <Grid xs={12} sm={4}>
                    <Controller
                    name="isActive"
                    control={control}
                    rules={{ required: 'isActive is required' }}
                    render={({ field,fieldState: { error } }) => {
                        const {onChange,value,ref,onBlur} = field; 
                    return <CustomAutoCompelete 
                    onChange={onChange}
                    lable={"Select isActive"}
                    hasError={error}
                    value={value}
                    onBlur={onBlur}
                    inputRef={ref}
                    options={["true","false"]}
                    getOptionLabel={(option)=> option==="true" ? "yes" : "no" }
                    /> 
                    }}
                    />
                  {
                     errors.isActive && <Typography variant="caption" color="error">IsActive is required</Typography> 
                  }
                </Grid>
            </Grid>

        </Box>

    </AddEditModal>
    
    <TableMainBox
           title={"Service Type Master"}
           buttonText={"Add Service Type"}
           onClick={() => {setOpenModal(true);clearErrors();}}
        >
            {
                ListLoading ? <><LinearProgress /><TableSkeleton/></> : Array.isArray(rowData) && rowData.length > 0 ? (
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
                      rowCount={serviceTypeCount} // baki**
                      pagination
                      pageSizeOptions={[10,30,50,100]}
                      paginationMode="server"
                    />
                  ) : (
                    <EmptyData />
                  )
            }

    </TableMainBox>
  </>;
}

export default ServiceTypeMaster;
