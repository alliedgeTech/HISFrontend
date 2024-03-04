import React, { useState,useMemo, useEffect } from 'react'
import { useRegionData } from '../../services/Add Master/Regionmaster'
import { useDispatch, useSelector } from "react-redux";
import { setCountryEditData, setCountryPagination } from '../../slices/region.slice';
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
import CommonTable from '../../Components/CommonTable/CommonTable';



function CountryMaster() {
    const { countryData,countryEditData,countryLoading,countryPagination,createCountry,updateCountry,getAllCountry,handleSwitch,countryCount } = useRegionData();
    
    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
        defaultValues:{
            isActive:"true",
            countryName:null
        },
        mode:"onTouched"
    });

    const dispatch = useDispatch();

    const [CountryModal, setCountryModal] = useState(false);

    const resetAllFields = () => {
        reset({
            countryName:null,
            isActive: "true",
        })
    }

    function closeCountryModal(){
        // do reset thing and edit things
        resetAllFields();
        setCountryModal(false);
        dispatch(setCountryEditData(null));
    }
    
    async function submitCountryData(data){

        if(countryEditData)
        {
            // update country
            let temp = await updateCountry(data);
            if(temp){
                closeCountryModal();
            }
        }
        else {
            delete data?._id;
            let temp = await createCountry(data);
            if(temp){
            closeCountryModal();
          }
        }
    }

    function funcSetCountryData(data){
        var id = countryPagination?.page * countryPagination?.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    _id: element?._id,
                    countryName: element?.countryName,
                    isActive: element?.isActive ,
                };
                array.push(thisData);
        });
    
        return array;
    }

    const CountryRowData = useMemo(() => { 
        if(countryData && Array.isArray(countryData) && countryLoading === false){
          return funcSetCountryData(countryData);
        }
    },[countryData,ListLoadingCountry]);

    const columns = [
        {
          field: "id",
          headerName: "ID",
        },
        {
            field:'_id',headerName:'_id',width:0
        },
        { field: "countryName", headerName: "Country Name", flex:1 },
        { field: "isActive", headerName: "Is Active", flex:1,
        renderCell: (params) => {
          return <IOSSwitch checked={params.row.isActive} onChange={(e)=>handleSwitch(params.row._id,e.target.checked,"country")}></IOSSwitch> 
        }
      },
        {
          field: "actions",
          headerName: "Actions",
          shortable: false,
          renderCell: (params) => (
            <>
              <div
                onClick={() => { setCountryModal(true); dispatch(setCountryEditData((true)));  
                    reset({ _id:params.row._id,countryName:params.row.countryName,isActive:params?.row?.isActive?.toString()  
                })}}
              >
                <CustomIconButton />
              </div>
              
            </>
          ),
        },
      ];

      const onPaginationChange = async({page,pageSize}) => {
        if(page!==countryPagination.page || pageSize !== countryPagination.pageSize )
        {
          const recentData = structuredClone(countryPagination);
          dispatch(setCountryPagination({page,pageSize}))

          if(page!==recentData.page)
          {
              // change the page
                const resData = await getAllCountry(true,page,pageSize);
                if(!resData)
                {
                  dispatch(setCountryPagination(recentData));
                }
    
          } else {
              // change the pageSize
              const resData = await getAllCountry(true,0,pageSize);
              
              if(!resData)
                {
                  dispatch(setCountryPagination(recentData));
                }
          }
        }
    } 

    console.log("this is count : ",countryCount);
       
      
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
            handleClose={closeCountryModal}
            handleSubmit={handleSubmit(submitCountryData)}
            open={CountryModal}
            modalTitle={countryEditData ? "Update Country" : "Add Country"}
            isEdit={!!countryEditData}
            Loading={countryLoading}
        >
            <Box
            component="form"
            onSubmit={handleSubmit(submitCountryData)}
            p={1}
            >   
                 <Grid 
                    container
                    spacing={{ md:3 ,xs:2  }}
                    // columns={{ xs: 4, sm: 8, md: 12 }}
                    justifyContent="space-between"
                    alignItems="center" 
                    > 
                    <Grid item xs={12} md={6}>
                        <CustomTextInputField
                            name="countryName"
                            label="Country Name"
                            control={control}
                            focused={true}
                            rules={{
                                required:{value:true,message:"Country Name is required"}
                            }}
                            error={errors?.countryName?.message}
                        />
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
           title={"Country Master"}
            buttonText={"Add Country"}
            onClick={() => {setCountryModal(true);clearErrors();}}
        >
            {
                ListLoadingCountry ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(CountryRowData) && CountryRowData.length > 0 ? (
                  <CommonTable columns={columns} count={countryCount} paginationModel={countryPagination} rowData={CountryRowData} onPaginationChange={onPaginationChange} customHeight='248px' />
                  ) : (
                    <EmptyData />
                  )
            }
        </TableMainBox>
    </> 
  )
}

export default CountryMaster