import React from 'react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Typography, Dialog,DialogContent,DialogTitle,Button } from "@mui/material"
import { useUserData } from '../../services/Adminastrator/UserMaster';
import { useRoleData } from '../../services/Adminastrator/RoleMaster';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from "@mui/material/Checkbox";
import { setBranchData } from '../../slices/branch.slice';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import CustomDatePickerField from '../../Components/InputsFilelds/CustomDatePickerField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import Switch from '@mui/material/Switch';
import { setUserPagination } from '../../slices/user.slice';
import toast from 'react-hot-toast';

function UserMaster() {
    const UserData = useSelector((state) => state.user?.userData);

  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
    clearErrors,
    getValues
  } = useForm({
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: "",
      linkEmployee: "",
      mobilenumber: "",
      primarylocation: null,
      address: "",
      pincode: "",
      isActive: "true",
      panNo:"",
      dob:"",
      doj:"",
      permanentAddress:"",
      designation:null,
      speciality:null,
      department:null,
      country:null,
      state:null,
      city:null,
      employeeCategory:null,
      gender:null,
      registrationNo:"",
      uhid:"",
      cellNO:"",
      title:null,
      virtualConsultation:null,
      languageSpoken:"",
      branch:null
    },
    mode: "onTouched",
  });

  const watchCity = watch("city");

  useEffect(() =>{ 
    if(watchCity)
    {
      setValue("state",watchCity?.stateId)
      setValue("country",watchCity?.stateId?.countryId)

    } else {
      setValue("state",null)
      setValue("country",null)
    }
  },[watchCity])




  const { updateUSer, addUser, Loading, assignRoleToUser, ListLoading,getUserData,userCount,paginationModel,getUserFindById } =
  useUserData();
const dispatch = useDispatch();
const RoleHook = useRoleData(); // check we need it or what 
const RoleData = useSelector((state) => state.role?.roleData);  
const [editData, setEditData] = useState("");
const [RoleId, setRoleId] = useState("");
const [ModalOpen, setModalOpen] = useState(false);
const [previewUrl, setPreviewUrl] = useState(null);
const [File, setFile] = useState(null);
const [fileError, setFileError] = useState(null);
const [RoleAssignModel, setRoleAssignModel] = useState(false);


const handleCheck = (checked, roleInfo) => {
    assignRoleToUser({ value: checked, roleId: roleInfo._id, userId: RoleId });
  };

  var submitData = async(data) => {
    data =  { ...data,primarylocationId:data.primarylocation._id,designation:data.designation._id,speciality:data.speciality._id,department:data.department._id,country:data.country._id,state:data.state._id,city:data.city._id,employeeCategory:data.employeeCategory._id,gender:data.gender.gender,title:data.title._id,virtualConsultation:data.virtualConsultation.value};
    
    delete data.role;

    if (editData) {

      let temp = await updateUSer(data,paginationModel.page,paginationModel.pageSize,File);
      if (temp) {
        setEditData("");
        reset();
        setModalOpen(false);
      }
    } else {
      data = { ...data,image:File }
      delete data?._id
      let temp = await addUser(data,paginationModel.page,paginationModel.pageSize); 
      if (temp) {
        reset();
        setModalOpen(false);
      }
    }
  };

  const CourseImageFile = (e) => {
    const selectedFile = e.target.files[0];
    if(!selectedFile)
    {
      setPreviewUrl(null);
      setFileError(true);
      return;
    }
    console.log("this is selected file:  ",selectedFile);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setFileError(false);
    };
    reader.readAsDataURL(selectedFile);
  };

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

  const RoleDataFilterd = useMemo(()=>{
    if(RoleData && Array.isArray(RoleData) && RoleData.length > 0)
    {
      return RoleData.filter((item)=>item?.isActive);
    }
    return [];    
  },[RoleData]);

  const setRows = (data) => {
    var id = paginationModel.page*paginationModel.pageSize;
    var array = [];
    data?.forEach((element) => {
      let thisData = {
        id: ++id,
        _id: element?._id,
        userName: element?.userName,
        email: element?.email,
        linkEmployee: element?.linkEmployee,
        mobilenumber: element?.mobilenumber,
        branch:element.branch,
        city: element?.city,
        address: element?.address,
        pincode: element?.pincode,
        isActive: element?.isActive,
        image:element?.image,
        panNo:element?.panNo,
      };
      array.push(thisData);
    });
    return array;
  };

  const rowData = useMemo(() => {
    if(UserData && Array.isArray(UserData) && ListLoading === false)
    {
      return setRows(UserData);
    }
  },[UserData,ListLoading])

  const closeTheModal = () => {
    setModalOpen(false);
    setPreviewUrl(null)
    setEditData("");
    setFileError(null);
    reset({
      name: "",
      userName: "",
      email: "",
      password: "",
      linkEmployee: "",
      mobilenumber: "",
      primarylocation: null,
      address: "",
      pincode: "",
      isActive: "true",
      panNo:"",
      dob:"",
      doj:"",
      permanentAddress:"",
      designation:null,
      speciality:null,
      department:null,
      country:null,
      state:null,
      city:null,
      employeeCategory:null,
      gender:null,
      registrationNo:"",
      uhid:"",
      cellNO:"",
      title:null,
      virtualConsultation:null,
      languageSpoken:"",
      branch:null
    });
    
  };

  useEffect(() => {

    async function setTheEditData() {
        let tempData = await getUserFindById(editData?._id);
        if(tempData) {
          const dataNew = [{value:'yes',shaw:true},{value:'no',shaw:false}].find((item)=>item.shaw == tempData?.virtualConsultation);

          tempData = {...tempData,primarylocation:tempData?.primarylocationId,gender:{gender:tempData.gender},virtualConsultation:dataNew,isActive:tempData?.isActive?.toString(),id:editData?.id}
  
        reset(tempData);
        setPreviewUrl(tempData?.image); 
        setModalOpen(true);
        } else {
          toast.error("something went wrong");
        }
    }
    if(editData)
    {
      setTheEditData();
    }
  }, [editData]);


const onPaginationChange = async({page,pageSize}) => {
    if(page!==paginationModel.page || pageSize !== paginationModel.pageSize )
    {
      const recentData = structuredClone(paginationModel);
      dispatch(setUserPagination({page,pageSize}));
      if(page!==paginationModel.page)
      {
          // change the page
            const resData = await getUserData(true,page,pageSize);
            if(!resData)
            {
              dispatch(setUserPagination(recentData));
            }

      } else {
          // change the pageSize
          const resData = await getUserData(true,0,pageSize);
          
          if(resData)
          {
            dispatch(setUserPagination(recentData))
          }
          
      }
    }
} 

  let TodayDate = new Date().toISOString().split("T")[0];

  const CustomAddModeratorOutlinedIcon = styled(AddModeratorOutlinedIcon)({
    // Add your custom styles here
    color: '#25396f', // Set the desired color
    cursor: 'pointer',
    '&:hover': {
      color: 'rgba(37, 57, 111, 0.8)', // Adjust the opacity for a lighter color on hover
    },
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width:"10"
    },
    { field: "_id", headerName: "", width: "0",flex:1, },
    {
      filed: "image",headerName:"Profile",rowHeight:200,renderCell:(params)=>(
        <img src={params.row.image} style={{width:"50%",maxWidth:"50px"}} />
      ),flex:1,sortable:false,
    },
    { field: "userName", headerName: "user Name", flex:1, },
    { field: "email", headerName: "Email",flex:1, },
    { field: "linkEmployee", headerName: "Linked Employee", flex:1, },
    { field: "mobilenumber", headerName: "Phone Number",flex:1, },
    { field: "address", headerName: "Address", flex:1, },
    { field: "pincode", headerName: "Code", flex:1, },
    {field:"branch", headerName:"Branch",flex:1,renderCell:(params)=>params.row.branch.location},
    { field: "isActive", headerName: "Is Active", flex:1 , sortable:false,
    renderCell : (params)=>(
       <IOSSwitch checked={params.row.isActive} onChange={(e)=>updateUSer({ _id: params?.row?._id,isActive:e.target.checked,id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1})}></IOSSwitch> 
      
    )
  },
  {
    field:"panNo",headerName:"Pan No",flex:1,
  },
    {
      field: "actions",sortable:false,
      headerName: "View Items",
      flex:1,
      renderCell: (params) => (
        <>
          <div
            className="btn btn-sm"
            onClick={() => {
              setEditData({_id:params.row._id,id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1});
            }}
          >
            <CustomIconButton />
          </div>
          <div
          style={{marginLeft:"0.7rem"}}
            onClick={() => {
              setRoleId(params.row.id-(paginationModel.page*paginationModel.pageSize));
              setRoleAssignModel(true);
            }}
          >
            <CustomAddModeratorOutlinedIcon />
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
         modalTitle={editData ? "Update User" : "Add User"}
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
                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                        name={"name"}
                        control={control}
                        label={"Name"}
                        focused={true}
                        rules={{required:{value:true,message:"Name is required"},maxLength:{value:50,message:"max length is 50"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                        name={"email"}
                        control={control}
                        label={"Email Address"}
                        rules={{required:{value:true,message:"Email is required"},pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                        ,message:"Please enter the valid email address"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                        name={"panNo"}
                        control={control}
                        label={"Pan No"}
                        rules={{required:{value:true,message:"Please enter the pan no"},minLength:{value:10 , message:"Please enter valid pan no"},pattern:{
                            value:/[A-Z]{5}[0-9]{4}[A-Z]{1}/ , message:"Please enter the valid pan no"
                          }}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                          <CustomDatePickerField 
                          name={"dob"}
                          control={control}
                          label={"Date of birth"}
                          rules={{valueAsDate:true,required:{value:true,message:"Please enter the dob"}}}
                          maxDate={TodayDate}
                          />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="designation"
                            control={control}
                            rules={{ required: 'Designation is required' }}
                            render={({ field,fieldState: { error } }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Designation"}
                            value={value}
                            onBlur={onBlur}
                            hasError={error}
                            getOptionLabel={(option)=>option?.designation}
                            url={"admin/addMaster/getdesignation"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                                errors.designation && <Typography variant="caption" color="error">Designation is  required</Typography> 
                        }
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: 'Please Select City' }}
                            render={({ field,fieldState: { error } }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Country"}
                            value={value} 
                            hasError={error}
                            onBlur={onBlur}
                            readOnly
                            disable
                            getOptionLabel={(option)=>option?.countryName}
                            url={"admin/regionMaster/country"}
                            filterOnActive={true}
                            inputRef={ref}
                            onInputChange={()=>console.log("beby")}
                            /> 
                            }}

                            > 
                        </Controller>
                            {
                                errors.country && <Typography variant="caption" color="error">Please select city</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="primarylocation"
                            control={control}
                            rules={{ required: 'Branch is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Branch"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.location}
                            url={"admin/locationMaster/getlocation"}
                            saveData={(data)=>dispatch(setBranchData(data))}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>

                            {
                                errors.primarylocation && <Typography variant="caption" color="error">Branch is required</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                        name={"registrationNo"}
                        control={control}
                        label={"Registration No"}
                        rules={{required:{value:true,message:"Registration No is required",maxLength:{value:50,message:"max length is 50"}}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Employee Title is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Employee Title"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.userTitle}
                            url={"admin/addMaster/title"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>

                        {
                            errors.title && <Typography variant="caption" color="error">Employee Title is required</Typography> 
                        }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"userName"}
                            control={control}
                            label={"User Name"}
                            rules={{required:{value:true,message:"Registration No is required",maxLength:{value:50,message:"max length is 50"}}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"pincode"}
                            control={control}
                            label={"Pincode"}
                            rules={{ minLength: {
                                value: 6,
                                message: 'PIN code should have at least 6 digits',
                              },
                              maxLength: {
                                value: 6,
                                message: 'PIN code should not exceed 6 digits',
                              },
                              required: {
                                value: true,
                                message: 'PIN code is required',
                              },
                              pattern: {
                                value: /^[0-9]*$/,
                                message: 'PIN code should be numeric',
                              },}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="linkEmployee"
                            control={control}
                            rules={{ required:{value:true} }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Linked Employee"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option}
                            options={["DR.ajh","Sr.kkkkk","Jr.jhjhjh"]}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>

                        {
                           errors.linkEmployee && <Typography variant="caption" color="error">Linked Employee is required</Typography> 
                        }
                    </Grid>

                    <Grid item xs={12} md={3}>
                       <CustomDatePickerField 
                          name={"doj"}
                          control={control}
                          label={"Date of Joining"}
                          rules={{valueAsDate:true,required:{value:true,message:"Please enter the doj"}}}
                          />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="speciality"
                            control={control}
                            rules={{ required: 'Speciality is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Speciality"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.speciality}
                            url={"admin/addMaster/getspeciality"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>

                            {
                                errors.speciality && <Typography variant="caption" color="error">Speciality is required</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="state"
                            control={control}
                            rules={{ required: 'State is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select State"}
                            readOnly
                            disable
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.stateName}
                            url={"admin/regionMaster/state"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>
                            {
                                errors.state && <Typography variant="caption" color="error">Please Select City</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="employeeCategory"
                            control={control}
                            rules={{ required: 'Employee Category is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Employee Category"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.categoryName}
                            url={"admin/addMaster/category"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>

                        {
                            errors.employeeCategory && <Typography variant="caption" color="error">Employee Category is required</Typography> 
                        }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"uhid"}
                            control={control}
                            label={"Uhid No"}
                            rules={{required:{value:true,message:"Uhid No is required"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="virtualConsultation"
                            control={control}
                            rules={{ required: 'Virtual Consultation is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Virtual Consultation"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.value}
                            options={[{value:"yes",shaw:"true"},{value:"no",shaw:"false"}]}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>

                            {
                                errors.virtualConsultation && <Typography variant="caption" color="error">VirtualConsultation is required</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"password"}
                            type={"password"}
                            control={control}
                            label={"Password"}
                            rules={{required:{value:true,message:"Password is required"},minLength:{value:6,message:"Please enter the min length 6"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"address"}
                            control={control}
                            label={"Address"}
                            rules={{required:{value:true,message:"Address is required"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"mobilenumber"}
                            type={"number"}
                            control={control}
                            label={"Mobile NO"}
                            rules={{required:{value:true,message:"Please enter the mobile number"},minLength:{value:10,message:"Please enter the min length 10"},maxLength:{value:10,message:"Please enter the max length 10"},pattern:{value:/^[0-9]*$/,message:"Please enter the valid mobile number"}}}
                        /> 
                    </Grid>

                    <Grid xs={12} md={3}>
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

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"permanentAddress"}
                            control={control}
                            label={"Permanent Address"}
                            rules={{required:{value:true,message:"Please enter the permenant address"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="department"
                            control={control}
                            rules={{ required: 'Department is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Department"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.department}
                            url={"admin/addMaster/getdepartment"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>
                            {
                                errors.department && <Typography variant="caption" color="error">Department is required</Typography> 
                            }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: 'City is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select City"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.cityName}
                            url={"admin/regionMaster/city"}
                            filterOnActive={true}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>
                        {
                            errors.city && <Typography variant="caption" color="error">City is required</Typography> 
                        }
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Controller
                            name="branch"
                            control={control}
                            rules={{ required: 'Branch is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Branch"}
                            value={value}
                            hasError={error}
                            onBlur={onBlur}
                            getOptionLabel={(option)=>option?.location}
                            url={"admin/locationMaster/getlocation/d"}
                            inputRef={ref}
                            /> 
                            }}

                            > 
                        </Controller>
                        {
                            errors.city && <Typography variant="caption" color="error">City is required</Typography> 
                        }
                    </Grid>

                    <Grid xs={12} md={3}>
                        <Controller
                            name="gender"
                            control={control}
                            rules={{ required: 'Gender is required' }}
                            render={({ field,fieldState:{error} }) => {
                                const {onChange,value,ref,onBlur} = field; 
                            return <CustomAutoCompelete 
                            onChange={onChange}
                            lable={"Select Gender"}
                            onBlur={onBlur}
                            hasError={error}
                            value={value}
                            getOptionLabel={(option)=>option?.gender}
                            options={[
                                { gender: "male" },
                                { gender: "female" },
                                { gender: "other" },
                                { gender: "non-binary" },
                                { gender: "prefer not to say" }
                            ]
                            }
                            inputRef={ref}
                            /> 
                            }}
                            > 
                        </Controller>
                        {
                            errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography> 
                        }
                    </Grid>
                        
                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"cellNO"}
                            control={control}
                            label={"Enter Cell NO"}
                            rules={{required:{value:true,message:"Cell NO is required"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <CustomTextInputField 
                            name={"languageSpoken"}
                            control={control}
                            label={"Language Spoken"}
                            rules={{required:{value:true,message:"Language Spoken is required"}}}
                        /> 
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <label htmlFor="image">
                            <Button component="label" variant="contained" fullWidth startIcon={<CloudUploadIcon />} style={{
                                background: "#25396f",
                                textTransform: 'none',
                                letterSpacing: "1px",
                                transition: "background 0.3s ease",
                                padding:"0.5rem 0.5rem",
                                '&:hover': {
                                background: 'rgba(37, 57, 111, 0.85)',
                                },}} >
                            <input
                              type="file"
                              className="form-control"
                              style={{ display: "none" }}
                              id="image"
                              accept=".png, .jpg, .jpeg"
                              onChange={CourseImageFile}
                            />
                            Upload Image
                            </Button>
                        </label>
                        {
                          fileError && <Typography variant="caption" color="error">Please select the image</Typography>
                        }
                    </Grid>

                      <Grid xs={12} md={3}>
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : <Typography style={{color:"#25396f"}} textAlign={"center"}>No Image Uploaded</Typography>}
                      </Grid>

              </Grid>

            </Box>

        </AddEditModal>

        <TableMainBox
        title={"User List"}
        buttonText={"Add User"}
        onClick={() => {setModalOpen(true);clearErrors();}}
        >
            {
                ListLoading ? <><LinearProgress /><TableSkeleton /></> : Array.isArray(rowData) && rowData.length !== 0 ? ( <DataGrid
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
                      rowCount={userCount}
                      pagination
                      pageSizeOptions={[10,30,50,100]}
                      paginationMode="server"
                    />) : (<EmptyData />)
            }
        </TableMainBox>


        <Dialog maxWidth="md" fullWidth open={RoleAssignModel} onClose={()=>setRoleAssignModel(false)}>
          <DialogTitle style={{fontWeight:550}}>Give Role To User</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={()=>setRoleAssignModel(false)}
            sx={{
              position: 'absolute',
              right: 30,
              top: 10,
              fontSize:"10px",
              color:'GrayText'
            }}
          >
            <CloseIcon style={{fontSize:"25px"}}/>
          </IconButton>
          <DialogContent
            sx={{
              p: '2rem',
            }}
          >
            {
            (Array.isArray(RoleDataFilterd) && RoleDataFilterd.length > 0) ? RoleDataFilterd.map((item, index) => (
                      <div key={index} style={{display:"flex", alignItems:"center"}}>
                        <Checkbox
                          checked={
                            RoleId &&
                            UserData[RoleId - 1]?.role?.findIndex((data) => data === item._id) !== -1
                          }
                          onChange={(e) => handleCheck(e.target.checked, item)}
                        />
                        <div>{item.role}</div>
                      </div>
                    )) 
                     : <div className="text-center text-xl font-semibold">No Role Found. Please First Create The Role</div>
                  }
          </DialogContent>
        </Dialog>
    </>
  )
}

export default UserMaster