import React, { useState,useMemo, useEffect } from 'react'
import { useRegionData } from '../../services/Add Master/Regionmaster'
import { useDispatch } from "react-redux";
import {setStateEditData, setStatePagination } from '../../slices/region.slice';
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
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import CommonTable from '../../Components/CommonTable/CommonTable';



function StateMaster() {
    const { stateData,stateEditData,stateLoading,statePagintion,createState,updateState,ListLoadingState,getAllState,handleSwitch,stateCount } = useRegionData();
     
    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
        defaultValues:{
            isActive:"true",
            stateName:null,
            countryName:null,
        },
        mode:"onTouched"
    });

    const dispatch = useDispatch();

    const [StateModal, setStateModal] = useState(false);

    const resetAllFields = () => {
        reset({
            stateName:null,
            countryName:null,
            isActive: "true",
        })
    }

    function closeStateModal(){
        // do reset thing and edit things
        resetAllFields();
        setStateModal(false);
        dispatch(setStateEditData(null));
    }
    
    async function submitStateData(data){

        if(stateEditData)
        {
            // update country
            let temp = await updateState(data,stateEditData);
            if(temp){
                closeStateModal();
            }
        }
        else {
            delete data?._id;
            let temp = await createState({...data,countryId:data?.countryName?._id});
            if(temp){
            closeStateModal();
          }
        }
    }

    function funcSetStateData(data){
        var id = statePagintion?.page * statePagintion?.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    _id: element?._id,
                    stateName: element?.stateName,
                    countryName: element?.countryId?.countryName,
                    isActive: element?.isActive,
                };
                array.push(thisData);
        });
    
        return array;
    }

    const StateRowData = useMemo(() => { 
        if(stateData && Array.isArray(stateData) && ListLoadingState  === false){
          return funcSetStateData(stateData);
        }
    },[stateData,ListLoadingState]);

    const columns = [
        {
          field: "id",
          headerName: "ID",
        },
        {
            field:'_id',headerName:'_id',width:0
        },
        {
          field: "actions",
          headerName: "Actions",
          shortable: false,
          renderCell: (params) => (
            <>
              <div
                onClick={() => { setStateModal(true); dispatch(setStateEditData((params.row.id-(statePagintion.page * statePagintion.pageSize))))}}
              >
                <CustomIconButton />
              </div>
              
            </>
          ),
        },
        { field: "isActive", headerName: "Is Active", flex:1,
        renderCell: (params) => {
          return <IOSSwitch checked={params.row.isActive} onChange={(e)=>handleSwitch(params?.row?._id,e.target.checked,"state")}></IOSSwitch> 
        }
         },
        { field: "stateName", headerName: "State Name",flex:1 },
        { field: "countryName", headerName: "Country Name", flex:1 },
      ];

      useEffect(()=>{
            if(stateEditData)
            {
                let temp = stateData[stateEditData-1];
                reset({
                  stateName:temp?.stateName,
                  countryName:temp?.countryId,
                  isActive:temp?.isActive?.toString()
                })
            }
      },[stateEditData])

      const onPaginationChange = async({page,pageSize}) => {
        if(page!==statePagintion.page || pageSize !== statePagintion.pageSize )
        {
          const recentData = structuredClone(statePagintion);
          dispatch(setStatePagination({page,pageSize}))

          if(page!==recentData.page)
          {
                const resData = await getAllState(true,page,pageSize);
                if(!resData)
                {
                  dispatch(setStatePagination(recentData));
                }
          } else {
              const resData = await getAllState(true,0,pageSize);
              
              if(!resData)
                {
                  dispatch(setStatePagination(recentData));
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
            handleClose={closeStateModal}
            handleSubmit={handleSubmit(submitStateData)}
            open={StateModal}
            modalTitle={stateEditData ? "Update State" : "Add State"}
            isEdit={!!stateEditData}
            Loading={stateLoading}
        >
            <Box
            component="form"
            onSubmit={handleSubmit(submitStateData)}
            p={1}
            >   
                 <Grid 
                    container
                    spacing={{ md:3 ,xs:2  }}
                    // columns={{ xs: 4, sm: 8, md: 12 }}
                    justifyContent="space-between"
                    alignItems="center" 
                    > 
                    <Grid item xs={12} md={4}>
                        <CustomTextInputField
                            name="stateName"
                            label="State Name"
                            control={control}
                            focused={true}
                            rules={{
                                required:{value:true,message:"State Name is required"}
                            }}
                            error={errors?.stateName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Controller
                            name="countryName"
                            rules={{ required: {value:true,message:"Country is required"} }}
                            control={control}
                            render={({ field }) => {
                            const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Country Name"}
                            onBlur={onBlur}
                            value={value}
                            getOptionLabel={(option)=>option?.countryName}
                            url={"admin/regionMaster/country"}
                            inputRef={ref}
                            filterOnActive={true}
                            hasError={!!errors?.countryName?.message}
                            /> 
                          }}
                            > 
                        </Controller>
                          
                            {
                              errors?.countryName && <Typography variant="caption" color="error">{errors?.countryName?.message}</Typography>
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
           title={"State Master"}
            buttonText={"Add State"}
            onClick={() => {setStateModal(true);clearErrors();}}
        >
            {
                ListLoadingState ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(StateRowData) && StateRowData.length > 0 ? (
                  <CommonTable columns={columns} count={stateCount} paginationModel={statePagintion} rowData={StateRowData} onPaginationChange={onPaginationChange}  customHeight='248px'/>
                  ) : (
                    <EmptyData />
                  )
            }
        </TableMainBox>
    </> 
  )
}

export default StateMaster