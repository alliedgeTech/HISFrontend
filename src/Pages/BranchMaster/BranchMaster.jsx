import React from 'react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';
import { Box,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useBranchData } from '../../services/Adminastrator/Locationmaster';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import toast from "react-hot-toast";
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

function BranchMaster() {
    var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
        defaultValues:{
          location:"",
          locationCode:"",
          isActive:"true",
          AdIpAddress:"",
          AdPort:"",
          AdDomainName:"",
          AdDomainType:""
        },
        mode:'onTouched'
      });

      const { addBranchData,updateBranchData,Loading,ListLoading,branchCount,getBranchData } = useBranchData();
      const [editData,setEditData] = useState('');
      const [OpenModal, setOpenModal] = useState(false);
      const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
      });

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
        setEditData(null)
        clearErrors();
        reset({
            location:"",
            locationCode:"",
            isActive:"true",
            AdIpAddress:"",
            AdPort:"",
            AdDomainName:"",
            AdDomainType:""
        });
      }

    const validateIP = (ip) => {
        // Regular expression for a basic IP address format
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      
        if (ipRegex.test(ip)) {
          // Additional check for valid octets (0 to 255)
          const octets = ip.split(".");
          for (let i = 0; i < octets.length; i++) {
            const octet = parseInt(octets[i]);
            if (octet < 0 || octet > 255 || isNaN(octet)) {
              return false;
            }
          }
          return true;
        }
      
        return false;
      };

      const onPaginationChange = async({page,pageSize}) => {

        if(page!==paginationModel.page || pageSize !== paginationModel.pageSize )
        {
          const recentState = structuredClone(paginationModel);
          setPaginationModel({page,pageSize});
          if(page!==paginationModel.page)
          {
              // change the page
                const resData = await getBranchData(true,page,pageSize);
                if(!resData)
                {
                  setPaginationModel(recentState);
                }
    
          } else {
              // change the pageSize
              const resData = await getBranchData(true,0,pageSize);
              
              if(!resData)
              {
                setPaginationModel(recentState)
              }
              
          }
        }
    } 

    const LocationData = useSelector(state => state.branch?.branchData);

    var submitData = async(data) => {
        console.log(" form data", data);
        if(!validateIP(data.AdIpAddress))
        {
          toast.error("Please enter valid IP Address")
          return ;
        }
        if(editData)
        {
          let temp = await updateBranchData(data,paginationModel.page,paginationModel.pageSize);
          if(temp){
  
            setEditData('');
            setOpenModal(false);
          }
         
        }
        else
        {
          let temp = await addBranchData(data,paginationModel.page,paginationModel.pageSize);
          if(temp)
          {
            setOpenModal(false);
            setEditData('');
          }
        }
        }

    const columns = [
        {
            field: "id",
            headerName: "ID",
        },
        { field: "_id", headerName: "", width: "0" },
        { field: "location", headerName: "Branch", flex:1 },
        { field: "locationcode", headerName: "Code", flex:1 },
        { field: "IsActive", headerName: "Is Active", flex:1 ,sortable:false,
        renderCell : (params) => {
        return  <IOSSwitch checked={params.row.IsActive} onChange={(e)=>updateBranchData({ _id: LocationData[params.row.id-1]?._id,isActive:e.target.checked},paginationModel.page,paginationModel.pageSize)}></IOSSwitch>  
        }
        },
        { field: "AddIpAddress", headerName: "IP Address",flex:1 },
        { field: "adport", headerName: "Add Port", flex:1 },
        { field: "addomainname", headerName: "Add Domain Name", flex:1 },
        { field: "adddomaintype", headerName: "Add Domain Type", flex:1 },
        {
            field: "actions",
            headerName: "Actions",
            sortable:false,
            renderCell: (params) => (
            <>
                <div
                className="btn btn-sm"
                onClick={() => {setEditData(params.row.id);setOpenModal(true)}} 
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
                    location: element?.location,
                    locationcode: element?.locationCode,
                    AddIpAddress: element?.AdIpAddress,
                    IsActive: element?.isActive ,
                    adport: element?.AdPort,
                    addomainname: element?.AdDomainName,
                    adddomaintype:element?.AdDomainType
                };
                array.push(thisData);
        });
        return array;
      };

      const rowData = useMemo(() => {
        if( LocationData !== undefined && Array.isArray(LocationData) && ListLoading === false){
          return setRows(LocationData)
        }
      },[LocationData,ListLoading])

      useEffect(()=>{
        if(editData)
        {
          reset({...LocationData[editData-1],isActive:LocationData[editData-1]?.isActive?.toString()});
        }
      },[editData])
    

  return (
    <>
        <AddEditModal 
          maxWidth="lg"
          handleClose={CloseModal}
          handleSubmit={handleSubmit(submitData)}
          open={OpenModal}
          modalTitle={editData ? "Update Branch" : "Add Branch"}
          isEdit={!!editData}
          Loading={Loading}
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
                 <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        name={"location"}
                        control={control}
                        label={"Location"}
                        focused={true}
                        rules={{required:{value:true,message:"Location is required"},maxLength:{value:50,message:"max length is 50"}}}
                        /> 
                 </Grid>

                 <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        name={"AdIpAddress"}
                        control={control}
                        label={"AD IP Address"}
                        rules={{required:{value:true,message:"IP Address is required"}}}
                        /> 
                 </Grid>

                 <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        name={"AdDomainType"}
                        control={control}
                        label={"Add Domain Type"}
                        rules={{required:{value:true,message:"Domain Type is required"}}}
                        /> 
                 </Grid>

                 <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        name={"locationCode"}
                        control={control}
                        label={"Location Code"}
                        rules={{required:{value:true,message:"Location Code is required"}}}
                        /> 
                 </Grid>

                 <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        type="number"
                        name={"AdPort"}
                        control={control}
                        label={"Add Port"}
                        rules={{required:{value:true,message:"port is required"},pattern:{
                            value:/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,message:"Please enter valid port"}}}
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

                <Grid xs={12} sm={3}>
                    <CustomTextInputField 
                        name={"AdDomainName"}
                        control={control}
                        label={"Add Domain Name"}
                        rules={{required:{value:true,message:"Domain Name is required"}}}
                        /> 
                 </Grid>

            </Grid>
          </Box>
            
        </AddEditModal>    

        <TableMainBox
           title={"Branch Master"}
           buttonText={"Add Branch"}
           onClick={() => {setOpenModal(true);clearErrors();}}
        >
            {
                ListLoading ? <><LinearProgress /><TableSkeleton/></> : Array.isArray(rowData) && rowData.length > 0 ? (
                    <DataGrid
                    style={{maxHeight:"calc(100vh - 179px)"}}
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
                      getRowClassName={(params) => !params?.row?.IsActive && "inactive-row"}
                      classes={{cellContent:"cellContent"}}
                      paginationModel={paginationModel}
                      onPaginationModelChange={(data) => onPaginationChange(data)}
                      rowCount={branchCount} // baki**
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

export default BranchMaster