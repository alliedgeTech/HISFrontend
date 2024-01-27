import React, { useState,useMemo } from 'react'
import { useForm,Controller } from 'react-hook-form';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Box, LinearProgress, Typography } from '@mui/material';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function CommonMaster({MainValue,Loading,ListLoading,add,update,get,tableData,paginationModel,setPaginationModal,editData,setEditData,FieldHeaderName,tableDataCount,customHeight="173px"}) {
  var { handleSubmit, formState: { errors },reset,control,clearErrors } = useForm({
    defaultValues: {
      value: "",
      isActive: "true",
    },
    mode:'onTouched'
  });
  const [ModalOpen, setModalOpen] = useState(false);

    const resetAll = () => {
      setModalOpen(false);
      setEditData("");
      reset({
        value: "",
        isActive: "true",
      });
      clearErrors();
    }

  const submitData = (data) => {
    const tempData = {};
    tempData[`${MainValue}`]=data.value;
    tempData["isActive"]=data.isActive;
    if(editData)
    {
      tempData["id"]=data.id;
      tempData["_id"]=data._id;
      console.log("step 1 : ",paginationModel);
      update(tempData,resetAll,paginationModel.page,paginationModel.pageSize);
    } else {
      add(tempData,resetAll,paginationModel.page,paginationModel.pageSize);
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
    const recentData = structuredClone(paginationModel);
    setPaginationModal({page,pageSize})
    if(page!==paginationModel.page)
    {
        // change the page
        console.log("this is data i am getting pagination new i am sending page",page,pageSize);
          const resData = await get(true,page,pageSize);
          if(!resData)
          {
            setPaginationModal(recentData);
          }

    } else {
        // change the pageSize
        const resData = await get(true,0,pageSize);
        
        if(!resData)
          {
            setPaginationModal(recentData);
          }
    }
  }
} 

  const closeTheModal = () => {
    reset({
      value: "",
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
                value: element?.[`${MainValue}`],
                isActive: element?.isActive,
            };
            array.push(thisData);
    });
    return array;
  }; 


  const rowData = useMemo(()=>{
    console.log("this is table data",tableData,ListLoading);
    if( tableData  && Array.isArray(tableData) && ListLoading === false){
       return setRows(tableData);                                 
    }
  },[tableData,ListLoading]);
                                    

  const columns =[  
        {
        field:"_id",
        headerName:"_id",
        width:0,
      },
      {
        field: "id",
        headerName: "ID",
      },
      { field: "value", headerName: FieldHeaderName, flex:1, minWidth:200},
      { field: "isActive", headerName: "Is Active", flex:1, minWidth:100,
       renderCell: (params) => (
      
        <IOSSwitch checked={params.row.isActive} onChange={(e)=>{update({ _id:params.row._id,isActive:e.target.checked,id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1},resetAll);console.log('@this is real pagination : ',params.row.id)}} />
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
              onClick={() => { setModalOpen(true);clearErrors(); reset({...params.row,isActive:params?.row?.isActive?.toString(),id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1});setEditData(true);}}
              >
              
              <CustomIconButton />
            </div>  

          </>
        ),
      }]

  
  return (

    <>  
      <AddEditModal
    maxWidth="lg"
    handleClose={closeTheModal}
    handleSubmit={handleSubmit(submitData)}
    open={ModalOpen}
    modalTitle={editData ? `Update ${FieldHeaderName}` : `Add ${FieldHeaderName}`}
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
                    name={"value"}
                    control={control} 
                    label={`${FieldHeaderName} Name`}
                    focused={true}
                    // required={true}
                    rules={{required:{value:true,message:`${FieldHeaderName} is required`},maxLength:{value:50,message:"max length is 50"}}}
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
           title={`${FieldHeaderName} Master`}
            buttonText={`Add ${FieldHeaderName}`}
            onClick={() => {setModalOpen(true);clearErrors();}}
            >
           { ListLoading ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(rowData) && rowData.length > 0 ? (
                  <DataGrid
                  style={{maxHeight:`calc(100vh - ${customHeight})`}}
                  initialState={{ pagination: { paginationModel: { pageSize: paginationModel.pageSize,page:paginationModel.page } } , 
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
                    rows={rowData}
                    slots={{ toolbar: GridToolbar }}
                    getRowHeight={(_data) => 'auto'}  
                    getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
                    classes={{cellContent:"cellContent"}}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(data) => onPaginationChange(data)}
                    rowCount={tableDataCount}
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

export default CommonMaster