import React, { useState,useMemo, useEffect } from 'react'
import { useRegionData } from '../../services/Add Master/Regionmaster'
import { useDispatch, useSelector } from "react-redux";
import { setCityEditData, setCityPagination, setCountryEditData, setCountryPagination } from '../../slices/region.slice';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import { useForm,Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { Switch,Box,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';



function CityMaster() {
    const { cityData,cityEditData,cityLoading,cityPagination,createCity,updateCity,ListLoadingCity,getAllCity,handleSwitch,cityCount } = useRegionData();
     
    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
        defaultValues:{
            isActive:"true",
            countryName:null,
            stateName:null,
            cityName:""
        },
        mode:"onTouched"
    });

    const dispatch = useDispatch();

    const [CityModal, setCityModal] = useState(false);

    const resetAllFields = () => {
        reset({
            isActive:"true",
            countryName:null,
            stateName:null,
            cityName:""
        })
    }

    function closeCityModal(){
        // do reset thing and edit things
        resetAllFields();
        setCityModal(false);
        dispatch(setCityEditData(null));
    }
    
    async function submitCityData(data){

        if(cityEditData)
        {
            // update country
            let temp = await updateCity(data);
            if(temp){
                closeCityModal();
            }
        }
        else {
            delete data?._id;
            let temp = await createCity({...data,stateId:data?.stateName?._id});
            if(temp){
            closeCityModal();
          }
        }
    }

    function funcSetCityData(data){
        var id = cityPagination?.page * cityPagination?.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    _id: element?._id,
                    cityName: element?.cityName,
                    stateName: element?.stateId?.stateName,
                    countryName: element?.stateId?.countryId?.countryName,
                    isActive: element?.isActive
                };
                array.push(thisData);
        });
    
        return array;
    }

    const CityRowData = useMemo(() => { 
        if(cityData && Array.isArray(cityData) && cityLoading === false){
          return funcSetCityData(cityData);
        }
    },[cityData,ListLoadingCity]);

    const columns = [
          {
            field: "id",
            headerName: "ID",
          },
          {
            field:"_id",headerName:"_id",hide:true
          },
          { field: "cityName", headerName: "City Name", flex:1},
          { field: "stateName", headerName: "State Name", flex:1 },
          { field: "countryName", headerName: "Country Name", flex:1 },
          { field: "isActive", headerName: "Is Active",flex:1,
          renderCell: (params) => {
            return <IOSSwitch checked={params.row.isActive}  onChange={(e)=>handleSwitch(params.row._id,e.target.checked,"city")}></IOSSwitch> 
          }
      
          },
          {
            field: "actions",
            headerName: "Actions",
            shortable: false,
            renderCell: (params) => (
              <>
                <div
                  onClick={() => { setCityModal(true); dispatch(setCityEditData((params.row.id-(cityPagination?.page*cityPagination?.pageSize))));}}
                >
                    <CustomIconButton />
                </div>
                
              </>
            ),
          },
      ];

      useEffect(()=>{
        if(cityEditData)
        {
          let temp = cityData[cityEditData-1];
          reset({
            cityName:temp?.cityName,
            stateName:temp?.stateId,
            isActive: temp?.isActive.toString()
          })
        }
      },[cityEditData])

      const onPaginationChange = async({page,pageSize}) => {
        if(page!==cityPagination.page || pageSize !== cityPagination.pageSize )
        {
          const recentData = structuredClone(cityPagination);
          dispatch(setCityPagination({page,pageSize}))

          if(page!==cityPagination.page)
          {
              // change the page
                const resData = await getAllCity(true,page,pageSize);
                if(!resData)
                {
                  dispatch(setCityPagination(recentData));
                }
    
          } else {
              // change the pageSize
              const resData = await getAllCity(true,0,pageSize);
              
              if(!resData)
                {
                  dispatch(setCityPagination(recentData));
                }
          }
        }
    } 
      
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
    
  return (
    <>
        <AddEditModal
            maxWidth="lg"
            handleClose={closeCityModal}
            handleSubmit={handleSubmit(submitCityData)}
            open={CityModal}
            modalTitle={cityEditData ? "Update City" : "Add City"}
            isEdit={!!cityEditData}
            Loading={cityLoading}
        >
            <Box
            component="form"
            onSubmit={handleSubmit(submitCityData)}
            p={1}
            >   
                 <Grid 
                    container
                    spacing={{ md:3 ,xs:2  }}
                    justifyContent="space-between"
                    alignItems="center" 
                    > 
                    <Grid item xs={12} md={6}>
                        <CustomTextInputField
                            name="cityName"
                            label="City Name"
                            control={control}
                            focused={true}
                            rules={{
                                required:{value:true,message:"City Name is required"}
                            }}
                            error={errors?.cityName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Controller
                            name="stateName"
                            rules={{required:{value:true,message:"State is required"}}}
                            control={control}
                            render={({ field }) => {
                            const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"State Name"}
                            value={value}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.stateName}
                            url={"admin/regionMaster/state"}
                            filterOnActive={true}
                            inputRef={ref}
                            hasError={!!errors?.stateName?.message}
                            /> 
                                }}
                            > 
                        </Controller>
                        {
                            errors?.stateName && <Typography variant="caption" color="error">{errors?.stateName?.message}</Typography>
                        }
                    </Grid>

                    <Grid xs={12} sm={6}>
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
           title={"City Master"}
            buttonText={"Add City"}
            onClick={() => {setCityModal(true);clearErrors();}}
        >
            {
                ListLoadingCity ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(CityRowData) && CityRowData.length > 0 ? (
                    <DataGrid
                    style={{maxHeight:"calc(100vh - 248px)"}}
                    initialState={{ pagination: { paginationModel: { pageSize: CityRowData.pageSize,page:CityRowData.page } } , 
                    columns: {
                      columnVisibilityModel: {
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
                      rows={CityRowData}
                      slots={{ toolbar: GridToolbar }}
                      getRowHeight={(_data) => 'auto'}  
                      getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
                      classes={{cellContent:"cellContent"}}
                      paginationModel={cityPagination}
                      onPaginationModelChange={(data) => onPaginationChange(data)}
                      rowCount={cityCount}
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
  )
}

export default CityMaster