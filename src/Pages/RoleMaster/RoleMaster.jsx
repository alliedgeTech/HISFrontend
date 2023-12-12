import React, { memo, useEffect, useMemo, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useRoleData } from '../../services/Adminastrator/RoleMaster';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import EmptyData from '../../Components/NoData/EmptyData';
import LinearProgress from '@mui/material/LinearProgress';
import CustomEditIcons from '../../Components/CustomeIcons/CustomEditIcons';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography } from "@mui/material"
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const RoleMaster =() => {
  var { register, handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
    defaultValues: {
      role: "",
      isActive: "true",
    },
    mode:'onTouched'
  });

  const { Loading,addRole,updateRole,ListLoading,getRoleData } = useRoleData();
  const { roleData:RoleData,roleCount} = useSelector(state => state.role);
  const [editData, setEditData] = useState('');
  const [ModalOpen, setModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  
 
  var submitData = async(data) => {
    if(editData)
    {
      console.log("this is edit data :  ",data);
      let temp = await updateRole({...data},paginationModel.page,paginationModel.pageSize); 
        if(temp){
          setEditData('');
          setModalOpen(false);                            
        }
    }
    else
    {
      delete data?._id
      let temp = await addRole(data,paginationModel.page,paginationModel.pageSize);
        if(temp){
          setModalOpen(false);
          reset({role:"",isActive:"true"})
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

const onPaginationChange = async({page,pageSize}) => {

    if(page!==paginationModel.page || pageSize !== paginationModel.pageSize )
    {
      // setPaginationModel({page,pageSize});
      if(page!==paginationModel.page)
      {
          // change the page
            const resData = await getRoleData(true,page,pageSize);
            if(resData)
            {
              setPaginationModel({page,pageSize});
            }

      } else {
          // change the pageSize
          const resData = await getRoleData(true,0,pageSize);
          
          if(resData)
          {
            setPaginationModel({page:0,pageSize})
          }
          
      }
    }
} 

const closeTheModal = () => {
          reset({
            role: "",
            isActive: "true",
          })
  setEditData("");
  setModalOpen(false);
};

const setRows = (data) => {
  let id = paginationModel.page*paginationModel.pageSize;
  let array = [];
  data?.forEach((element) => {
          let thisData = {
              _id:element?._id,
              id: ++id,
              role: element?.role,
              isActive: element?.isActive,
          };
          array.push(thisData);
  });
  console.log("roleData this is array return",array)
  return array;
};  

const rowData = useMemo(()=>{
  if( RoleData  && Array.isArray(RoleData) && ListLoading === false){
     return setRows(RoleData);
  }
},[RoleData,ListLoading]);

const columns = [
  {
    field:"_id",
    headerName:"_id",
    width:0,
  },
  {
    field: "id",
    headerName: "ID",
  },
  { field: "role", headerName: "Role", flex:1 },
  { field: "isActive", headerName: "Is Active", flex:1,sortable:false, 
   renderCell: (params) => (
    <IOSSwitch checked={params.row.isActive} onChange={(e)=>updateRole({ _id:params.row._id,isActive:e.target.checked,id:params.row.id},paginationModel.page,paginationModel.pageSize)} />
  ) 
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable:false,
    width: 150,
    renderCell: (params) => (
      <>
        <div
          onClick={() => { setModalOpen(true);clearErrors(); reset({...params.row});setEditData(true)}}
        >
          <CustomEditIcons />
        </div>
        
      </>
    ),
  },
];

// footer stick to bottom

  return (
    <>
        <AddEditModal 
            maxWidth="lg"
            handleClose={closeTheModal}
            handleSubmit={handleSubmit(submitData)}
            open={ModalOpen}
            modalTitle={editData ? "Update Role" : "Add Role"}
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
                // columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="space-between"
                alignItems="center" 
              > 
              <Grid xs={12} sm={6}>

                  <CustomTextInputField 
                  name={"role"}
                  control={control}
                  label={"Role Name"}
                  focused={true}
                  // required={true}
                  rules={{required:{value:true,message:"role is required"},maxLength:{value:50,message:"max length is 50"}}}
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
            {/* ****************************************** listing ************************************************************    */}
           <TableMainBox
           title={"Role Master"}
            buttonText={"Add Role"}
            onClick={() => {setModalOpen(true);clearErrors();}}
            >
           { ListLoading ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(rowData) && rowData.length > 0 ? (
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
                    getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
                    classes={{cellContent:"cellContent"}}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(data) => onPaginationChange(data)}
                    rowCount={roleCount}
                    pagination
                    pageSizeOptions={[10,30,50,100]}
                    paginationMode="server"
                  />
                ) : (
                  <EmptyData />
                )}

           </TableMainBox>

             
    </>
  )
}


export default memo(RoleMaster);