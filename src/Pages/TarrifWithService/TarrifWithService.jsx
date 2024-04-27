import React, { useCallback, useMemo, useState } from 'react'
import { useTarrifWithServiceData } from '../../services/Add Master/TarrifWithService'
import { useDispatch, useSelector } from 'react-redux';
import { setTarrifWithServiceEditData, setTarrifWithServicePagination } from '../../slices/tarrif.slice';
import { useForm,Controller } from 'react-hook-form';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { Box,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import AddEditModal from '../../Components/AddEditModal/AddEditModal'
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import CommonTable from '../../Components/CommonTable/CommonTable';

function TarrifWithService() {
    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
        defaultValues:{
            tarrif:null,
            service:null,
            bedType:null,
            discount:0,
            isActive:"true"
        },
        mode:'onTouched'
      });

    const [openModal, setOpenModal] = useState(false);
    const { createTarrifWithServiceData,getTarrifWithServiceData,updateTarrifWithServiceData } = useTarrifWithServiceData()
    const { tarrifWithServiceData,editTarrifWithServiceData,tarrifWithServiceCount,tarrifWithServicePagination:paginationModel,tarrifWithServiceLoading,tarrifWithServiceListLoading:listLoading } = useSelector(state => state.tarrif);
    const dispatch = useDispatch();

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
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
              backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
              opacity: 1,
              border: 0
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.5
            }
          },
          "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff"
          },
          "&.Mui-disabled .MuiSwitch-thumb": {
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[600]
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: theme.palette.mode === "light" ? 0.7 : 0.3
          }
        },
        "& .MuiSwitch-thumb": {
          boxSizing: "border-box",
          width: 22,
          height: 22
        },
        "& .MuiSwitch-track": {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
          opacity: 1,
          transition: theme.transitions.create(["background-color"], {
            duration: 500
          })
        }
      }));

      const CloseModal = () => {
        setOpenModal(false);
        dispatch(setTarrifWithServiceEditData(null));
        clearErrors();
        reset({
            tarrif:null,
            service:null,
            bedType:null,
            discount:0,
            isActive:"true"
        });
      }

      const onPaginationChange = async({page,pageSize}) => {

          if(page!==paginationModel.page || pageSize !== paginationModel.pageSize )
          {
            const recentState = structuredClone(paginationModel);
            dispatch(setTarrifWithServicePagination({page,pageSize}))
            if(page!==recentState.page)
            {
                // change the page
                  const resData = await getTarrifWithServiceData(true,page,pageSize);
  
                  if(!resData)
                  {
                    dispatch(setTarrifWithServicePagination(recentState))
                  }
      
            } else {
                // change the pageSize
                const resData = await getTarrifWithServiceData(true,0,pageSize);
                
                if(!resData)
                {
                  dispatch(setTarrifWithServicePagination(recentState))
                }
            }
          }
      }

    var submitData = async(data) => {

        const tempData = { discount:data?.discount,tarrif:data?.tarrif?._id,bedType:data.bedType?._id,service:data?.service?._id,isActive:data?.isActive,id:data.id };

        if(editTarrifWithServiceData)
        { 
          tempData._id = data._id;
          let temp = await updateTarrifWithServiceData(tempData);
          if(temp){
            CloseModal();
          }
         
        }
        else
        {
          let temp = await createTarrifWithServiceData(tempData);

          if(temp)
          {
            CloseModal();
          }
        }
    }

    const columns = useMemo(() => [
      {
          field: "id",
          headerName: "ID",
          minWidth: 50,
          headerAlign: "center",
          align: "center",
      },
      { field: "_id", headerName: "", width: "0" },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        headerAlign: "center", align: "center",
        renderCell: (params) => (
            <>
                <div
                    className="btn btn-sm"
                    onClick={() => { dispatch(setTarrifWithServiceEditData(true));setOpenModal(true);reset({...params.row,isActive:params.row.isActive.toString(),id:params.row.id - (paginationModel.page * paginationModel.pageSize) -1}) }}
                >   
                  <CustomIconButton />
                </div>
            </>
        ),
      },
      { field: "isActive", headerName: "Is Active", flex: 1, headerAlign: "center", align: "center",minWidth:100,
      renderCell: (params) => {
          return <IOSSwitch checked={params.row.isActive} onChange={(e) =>  updateTarrifWithServiceData({ _id: tarrifWithServiceData[params.row.id - (paginationModel.page * paginationModel.pageSize) - 1]?._id, isActive: e.target.checked,id:params.row.id - (paginationModel.page * paginationModel.pageSize) -1})
          }
            ></IOSSwitch>
      }
      },
      { field: "tarrif", headerName: "Tarrif", flex: 1, headerAlign: "center", align: "center",minWidth:150,renderCell:(params) => (params.row.tarrif.tariffName)},
      { field: "service", headerName: "Service", flex: 1, headerAlign: "center", align: "center",minWidth:180,renderCell : (paramas) => {
          return <span>{paramas.row.service?.serviceName} {`(${paramas.row?.service?.serviceType?.serviceTypeName})`} </span>
      } },
      { field: "bedType", headerName: "Bed Type", flex: 1, headerAlign: "center", align: "center",minWidth:180,renderCell : (params) => {
          return <span>{params.row.bedType?.bedName}</span>
      } },
      { field: "discount", headerName: "Discount", flex: 1, headerAlign: "center", align: "center",minWidth:100,renderCell : (paramas) => {
          return <span>{paramas.row.discount}%</span>
      }
      },
  ], [paginationModel,tarrifWithServiceData]);

    const setRows = (data) => {
        var id = paginationModel.page*paginationModel.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    _id: element?._id,
                    tarrif:element?.tarrif,
                    service:element?.service,
                    bedType:element?.bedType,
                    discount:element?.discount,
                    isActive:element?.isActive
                };
                array.push(thisData);
        });
        return array;
      };

    const rowData = useMemo(() => {
        if( tarrifWithServiceData !== undefined && Array.isArray(tarrifWithServiceData) && listLoading === false){
          return setRows(tarrifWithServiceData)
        }
        },[tarrifWithServiceData,listLoading])

    


  return (
    <>
             <AddEditModal 
          maxWidth="lg"
          handleClose={CloseModal}
          handleSubmit={handleSubmit(submitData)}
          open={openModal}
          modalTitle={editTarrifWithServiceData ? "Update Tarrif - Service" : "Add Tarrif - Service"}
          isEdit={!!editTarrifWithServiceData}
          Loading={tarrifWithServiceLoading}
        >
          <Box
          component="form"
          onSubmit={handleSubmit(submitData)}
          p={1}
          >
            <Grid 
            container
            spacing={{ md:3 ,xs:2  }}
            alignItems="center" 
            > 
                  <Grid item xs={12} md={3}>
                        <Controller
                            name="tarrif"
                            control={control}
                            rules={{ required: 'Tarrif is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Tarrif"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.tariffName}
                            url={"admin/addMaster/tarrifMaster"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                            errors.tarrif && <Typography variant="caption" color="error">Tarrif is required</Typography> 
                        }
                    </Grid>

                  <Grid item xs={12} md={3}>
                        <Controller
                            name="service"
                            control={control}
                            rules={{ required: 'Service is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Service"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=> ( `${option.serviceName} (${option.serviceType.serviceTypeName})`)}
                            url={"admin/billing/serviceMaster"}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                            errors.service && <Typography variant="caption" color="error">Service is required</Typography> 
                        }
                    </Grid>

                  <Grid item xs={12} md={3}>
                        <Controller
                            name="bedType"
                            control={control}
                            rules={{ required: 'bedType is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select bedType"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.bedName}
                            url={"admin/addMaster/bedType"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                            errors.bedType && <Typography variant="caption" color="error">BedType is required</Typography> 
                        }
                    </Grid>

                 <Grid xs={12} sm={3}>
                    <CustomTextInputField
                        type={"number"}   
                        name={"discount"}
                        control={control}
                        label={"Discount"}
                        rules={{required:{value:true,message:"Discount is required"},max:{value:100,message:"max number is 100",min:{value:0,message:"min number is 0"}}}}
                        /> 
                 </Grid>

                 
                 <Grid xs={12} sm={3}>
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
           title={"Tarrif With Service Master"}
           buttonText={"Add Tarrif With Service"}
           onClick={() => {setOpenModal(true);clearErrors();}}
        >
            {
                listLoading ? <><LinearProgress /><TableSkeleton/></> : Array.isArray(rowData) && rowData.length > 0 ? (
                  <CommonTable columns={columns} count={tarrifWithServiceCount} paginationModel={paginationModel} rowData={rowData} onPaginationChange={onPaginationChange}/>
                  ) : (
                    <EmptyData />
                  )
            }

        </TableMainBox>


    </>

    )
}

export default TarrifWithService