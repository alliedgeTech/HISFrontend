import React from 'react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import { Box,Switch,Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useCategoryMaster } from '../../services/Add Master/CategoryMaster';
import { setCategoryEditData, setCategoryPagination } from '../../slices/category.slice';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';

function CategoryMaster() {

    var { handleSubmit, formState: { errors },reset,clearErrors,control } = useForm({
        defaultValues: {
          categoryName: "",
          isActive: "true",
        },
        mode:"onBlur"
      });

      const [ModalOpen, setModalOpen] = useState(false);
    //   const [paginationModel, setPaginationModel] = useState({
    //     pageSize: 10,
    //     page: 0,
    //   });

      const { categoryData,listLoading,categoryEditData,actionLoading,categoryCount,categoryPagination:paginationModel } = useSelector(state => state.category);

      const dispatch = useDispatch();

      const { createCategoryData,updateCategoryData,getCategoryData } = useCategoryMaster();

      const submitData = async(data) => {
        if(categoryEditData)
        {
          let categorytempData = {categoryId:categoryData[categoryEditData-1]?._id,...data};
          let temp = await updateCategoryData(categorytempData,paginationModel.page,paginationModel.pageSizef); 
            if(temp){
              closeTheModal();
            }
        }
        else
        {
          let temp = await createCategoryData(data,paginationModel.page,paginationModel.pageSize);
            if(temp){
              closeTheModal();
            }
        }
      }

      const closeTheModal = () => {
        setModalOpen(false);
        dispatch(setCategoryEditData(null));
        reset({
          categoryName: "",
          isActive: "true",
        })
      }

      const setRows = (data) => {
        console.log("paginationModel",paginationModel);
        var id = paginationModel.page*paginationModel.pageSize;
        var array = [];
        data?.forEach((element) => {
                let thisData = {
                    id: ++id,
                    category: element?.categoryName,
                    isActive: element?.isActive,
                };
                array.push(thisData);
        });
        return array;
      };  

      const RowData = useMemo(() => {
        if( categoryData && Array.isArray(categoryData) && listLoading === false){
        return  setRows(categoryData)
        }  
      },[categoryData,listLoading]);

      useEffect(()=>{
        if(categoryEditData)
        {
            const temp = categoryData[categoryEditData-1];
            reset({...temp,isActive:temp?.isActive?.toString()});
        }
      },[categoryEditData]);

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
            dispatch(setCategoryPagination({page,pageSize}));
          if(page!==paginationModel.page)
          {
              // change the page
                const resData = await getCategoryData(true,page,pageSize);

                if(!resData)
                {
                    dispatch(setCategoryPagination(recentData));
                }
    
          } else {
              // change the pageSize
              const resData = await getCategoryData(true,0,pageSize);
              
              if(!resData)
              {
                dispatch(setCategoryEditData(recentData))
              }
              
          }
        }
    } 

      const columns = [
        {
          field: "id",
          headerName: "ID",
        },
        { field: "category", headerName: "Category", flex:1 },
        { field: "isActive", headerName: "Is Active",flex:1
        , renderCell: (params) => (
          <IOSSwitch checked={params.row.isActive} onChange={(e)=>updateCategoryData({ categoryId: categoryData[params.row.id-(paginationModel.page*paginationModel.pageSize)-1]?._id,isActive:e.target.checked},paginationModel.page,paginationModel.pageSize)}></IOSSwitch> 
        )
      },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          renderCell: (params) => (
            <>
              <div
                onClick={() => { setModalOpen(true); dispatch(setCategoryEditData(params.row.id-(paginationModel.page*paginationModel.pageSize)));}}
              >
                <CustomIconButton />
              </div>
              
            </>
          ),
        },
      ];

  return (
    <>
         <AddEditModal 
            maxWidth="lg"
            handleClose={closeTheModal}
            handleSubmit={handleSubmit(submitData)}
            open={ModalOpen}
            modalTitle={categoryEditData ? "Update Category" : "Add Category"}
            isEdit={!!categoryEditData}
            Loading={actionLoading}
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
                        name={"categoryName"}
                        control={control}
                        label={"Category"}
                        focused={true}
                        rules={{required:{value:true,message:"Category is required"},maxLength:{value:50,message:"max length is 50"}}}
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
           title={"Category Master"}
            buttonText={"Add Category"}
            onClick={() => {setModalOpen(true);clearErrors();}}
        >
                { listLoading ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(RowData) && RowData.length > 0 ? (
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
                    rows={RowData}
                    slots={{ toolbar: GridToolbar }}
                    getRowHeight={(_data) => 'auto'}  
                    getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
                    classes={{cellContent:"cellContent"}}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(data) => onPaginationChange(data)}
                    rowCount={categoryCount}
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

export default CategoryMaster