import React, { useState ,useMemo, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setAppointmentEditData, setAppointmentpagination } from '../../slices/appointment.slice';
import { useAppointmentData } from '../../services/Consultant Dashboard/Appointment';
import CustomIconButton from '../../Components/CustomeIcons/CustomEditIcons';
import AddEditModal from '../../Components/AddEditModal/AddEditModal';
import { CustomTextInputField } from '../../Components/InputsFilelds/CustomTextInputField';
import CustomDateTimePickerField from '../../Components/InputsFilelds/CustomDateTimePickerField';
import CustomAutoCompelete from '../../Components/CustomAutoCompelete/CustomAutoCompelete';
import TableMainBox from '../../Components/TableMainBox/TableMainBox';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import EmptyData from '../../Components/NoData/EmptyData';
import { useForm,Controller } from 'react-hook-form';
import { Box, LinearProgress, Typography } from '@mui/material';
import CustomDatePickerField from '../../Components/InputsFilelds/CustomDatePickerField';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Grid from '@mui/material/Unstable_Grid2';
import APIManager from '../../utils/ApiManager';
import { useFrontOfficeRegistration } from '../../services/FrontOffice/Registration';
import SearchIcon from '@mui/icons-material/Search';
import CustomButton from '../../Components/Button/Button';
import SearchRegistration from './components/SearchRegistration';
import dayjs from 'dayjs';

function Appointment() {

  const dispatch = useDispatch();
  const { appointmentData,appointmentLoading,appointmentEditData,appointmentCount,appointmentPagination:paginationModel }  = useSelector(state => state.appointment)
  var { handleSubmit, formState: { errors },reset,control,clearErrors,watch,setValue,getValues } = useForm({
      defaultValues: {
        doctor: null,
        appointmentType: 'walkin',
        appointmentDateTime:"",
        registration:null,
        mobileNo:"",
        visitType:null,
        title:null,
        pationName:"",
        dob:'',
        age:"",
        gender:null,
        address:"",
        city:null,
        otherRemarks:'',
      },
      mode:'onTouched'
    });
  let TodayDate = new Date().toISOString().split("T")[0];
  const [ModalOpen, setModalOpen] = useState(false);
  const [newRegistrationForm,setNewRegistrationForm] = useState(false);
  const [RegistrationNumberFound, setRegistrationNumberFound] = useState(false);
  const [SeachRegistrationModal, setSeachRegistrationModal] = useState(false);
  const { ListLoading,createAppointmentData,getAppintmentData,updateAppointmentData } = useAppointmentData();
  const { getRegistrationData } = useFrontOfficeRegistration();
  const MobileNumberWatch = watch("mobileNo");

  const isValidMobileNumber = (number) => {
    if (number?.length === 10 && !isNaN(number)) {
      return true;
    }
    return false;
  
  }

  const VisitTypeData = [{value:"firstVisit",shaw:"First Visit"},{value:"followUp",shaw:"Follow Up"}];

  const ApiManager = new APIManager();

      const setRegistrationModalData = async(tempData) => {
        let url;
        console.log("this is temp data ",tempData);
        if(tempData)
        {
          url=`admin/frontOffice/registration/m/${tempData}?type=id`
        } else {
          url=`admin/frontOffice/registration/m/${MobileNumberWatch}`
        }

        const data = await ApiManager.get(url);

        if(!data.error)
        {
          setNewRegistrationForm(true);
          if(data?.data?.data) {
            const tempData = {...data?.data?.data,gender:{gender:data?.data?.data?.gender}};

            setRegistrationNumberFound(tempData?._id);

            const fieldSet = ['pationName','title','dob','age','gender','address','city','otherRemarks'];
            for(let i of fieldSet)
            {
              setValue(i,tempData[i])
            }

          } else {
            setRegistrationNumberFound(false);
            const fieldSet = ['pationName','dob','age','address','otherRemarks'];
            for(let i of fieldSet)
            {
              setValue(i,"")
            }
            const FieldSetNull = ["title","gender","city"];
            for(let i of FieldSetNull)
            {
              setValue(i,null)
            }
          }

        } else {
          setNewRegistrationForm(false);
        }
      }

      useEffect(() => {
        if (isValidMobileNumber(MobileNumberWatch)) {
          const timeoutId = setTimeout(() => {
            setRegistrationModalData();
          }, 300);

          return () => clearTimeout(timeoutId);
        }
      },[MobileNumberWatch])

      useEffect(() =>{ 
        console.log('this is modal : ',SeachRegistrationModal);
      },[SeachRegistrationModal])
      
      const closeTheModal = () => {
        setModalOpen(false);
        setRegistrationNumberFound(false);
        setNewRegistrationForm(false);
        dispatch(setAppointmentEditData(false));
        reset({
            doctor: null,
            appointmentType: 'walkin',
            appointmentDateTime:"",
            registration:null,
            mobileNo:"",
            visitType:null,
            title:null,
            pationName:"",
            dob:'',
            age:"",
            gender:null,
            address:"",
            city:null,
            otherRemarks:''
        });
        clearErrors();
      } 

      const setSomeSearchDataInForm = (data) => {
        const temp = getValues();
        if(!temp.doctor)
        {
          console.log("this is data  doctor ",data.doctor);
          setValue("doctor",data.doctor);
        }
          setValue("mobileNo",data.mobileNo);
     }

      const submitData = async(data) => {

        if(appointmentEditData)
        {
          const tempData = await updateAppointmentData({...data,AppointmentId:data?._id,doctor:data.doctor._id,visitType:data.visitType.value,})    

          if(tempData) {
            closeTheModal();
          }

        } else if(newRegistrationForm) {
            if(RegistrationNumberFound)
            {
              // old registration found
              const tempData = await createAppointmentData({doctor:data.doctor._id,appointmentType:data.appointmentType,registration:RegistrationNumberFound,visitType:data.visitType.value,appointmentDateTime:data.appointmentDateTime});

              if(tempData)
              {
                closeTheModal();
              }

            } else {
              // new registration
              const tempData = await createAppointmentData({
                doctor:data.doctor._id,
                appointmentType:data.appointmentType,
                visitType:data.visitType.value,
                appointmentDateTime:data.appointmentDateTime,
                title:data.title._id,age:data?.age,
                pationName:data?.pationName,
                gender:data?.gender?.gender,
                dob:dayjs(data?.dob?.$d)?.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                city:data?.city?._id,
                mobileNo:data?.mobileNo,
                otherRemarks:data?.otherRemarks,
              })
            
              if(tempData)
              {
                getRegistrationData();
                closeTheModal();
              }
            }
        }
       
      }

      const onPaginationChange = async({page,pageSize}) => {
        if(page!==paginationModel.page || pageSize !== paginationModel.pageSize )
        {
          const recentData = structuredClone(paginationModel);
          dispatch(setAppointmentpagination({page,pageSize}));

          if(page!==paginationModel.page)
          {
                const resData = await getAppintmentData(true,page,pageSize);
                if(!resData)
                {
                  dispatch(setAppointmentpagination(recentData));
                }
      
          } else {
              const resData = await getAppintmentData(true,0,pageSize);
              
              if(!resData)
                {
                  dispatch(setAppointmentpagination(recentData));
                }
          }
        }
      } 

      const setRows = (data) => {
        let id = paginationModel.page*paginationModel.pageSize;
        let array = [];
        data?.forEach((element) => {
                let thisData = {
                    _id:element?._id,
                    id: ++id,
                    pationName:element?.registration?.pationName,
                    title:element?.registration?.title?.userTitle,
                    age:`${element?.registration?.age}`,
                    gender:`${element?.registration?.gender}`,
                    doctor:element?.doctor,
                    appointmentType:element?.appointmentType,
                    appointmentDateTime:element?.appointmentDateTime,
                    visitType:element?.visitType,
                    mobileNo:element?.registration?.mobileNo,
                    bloodGroup:element?.registration?.bloodGroup,
                    city:element?.registration?.city?.cityName,
                };
                array.push(thisData);
        });
        return array;
      }; 

      const rowData = useMemo(()=>{
        if( appointmentData  && Array.isArray(appointmentData) && ListLoading === false){
           return setRows(appointmentData);                                 
        }
      },[appointmentData,ListLoading]);

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
      {
        field: "pationName",
        headerName: "Pation Name",
        flex:1,
        renderCell: (params) => ( 
          <div>{params.row.title} {params.row.pationName}</div>
        )
      },
      {
        field: "age",
        headerName:"Age",
        headerAlign:"center",
        align:"center",
        width:100,
      },
      {
        field: "gender",
        headerName:"Gender",
        flex:1
      },
      {
        field:'city',
        headerName:"City",
        flex:1,
      },
      {
        field: "mobileNo",
        headerName:"Mobile No",
        flex:1
      },
      {
        field: "appointmentType",
        headerName:"Appointment Type",
        width:120,
      },
      {
        field: "visitType",
        headerName:"Visit Type",
        flex:1,
      },
      {
        field: "appointmentDateTime",
        headerName:"Appointment Date Time",
        renderCell:(params)=>new Date(params?.row?.appointmentDateTime).toLocaleString(),
        width:250,
      },
      {
        field:'doctor',
        headerName:"Doctor",
        renderCell : (params) => <div>{params?.row?.doctor?.userName}</div>,
        flex:1
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable:false,
        width: 150,
        renderCell: (params) => (
          <>
            <div
              onClick={() => { setModalOpen(true);clearErrors(); reset({...params.row,visitType:VisitTypeData.find((d)=>d.value==params.row.visitType),id:params.row.id-(paginationModel.page*paginationModel.pageSize)-1});dispatch(setAppointmentEditData(true))}}
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
         modalTitle={appointmentEditData ? `Update Appointment` : `Add Appointment`}
         isEdit={!!appointmentEditData}
         Loading={appointmentLoading}
      >
         <Box
          component="form"
          onSubmit={handleSubmit(submitData)}
          p={3}
        >
            <Grid 
                container
                spacing={{ md:3 ,xs:2  }}
                // columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="space-between"
                alignItems="center" 
              >   
                <Grid xs={12} sm={4}>
                   <Controller
                        name="doctor"
                        control={control}
                        rules={{ required: 'Doctor is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete 
                        onChange={onChange}
                        lable={"Select Doctor"}
                        value={value}
                        getOptionLabel={(option)=>` ${option?.userName} / ${option?.speciality?.speciality}`}
                        url={"admin/userMaster/user/doctor"}
                        inputRef={ref}
                        hasError={error}
                        isOptionEqualToValue={(op,val) => { console.log("this is reality : ",op,"v : ",val,"ans:",op._id==(val || val?._id)); return op._id==(val || val?._id) }}
                        /> 
                        }}

                        > 
                    </Controller>
                </Grid>

                <Grid xs={12} sm={4}>
                   <Controller
                        name="appointmentType"
                        control={control}
                        rules={{ required: 'Appointmnet type is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete 
                        onChange={onChange}
                        lable={"Appointment Type"}
                        value={value}
                        getOptionLabel={(option)=>option}
                        options={['walkin','scheduled']}
                        inputRef={ref}
                        hasError={error}
                        /> 
                        }}
                        > 
                    </Controller>
                </Grid>

                <Grid xs={12} sm={4}>
                  <CustomDateTimePickerField 
                          name={"appointmentDateTime"}
                          control={control}
                          label={"Appointment Date Time"}
                          rules={{valueAsDate:true,required:{value:true,message:"Appointment date&time is required"}}}
                          />
                </Grid>

                <Grid xs={12} sm={4}>
                    <CustomTextInputField 
                            name={"mobileNo"}
                            type={"number"}
                            control={control}
                            label={"Mobile NO"}
                            rules={{required:{value:true,message:"Please enter the mobile number"},minLength:{value:10,message:"Please enter the min length 10"},maxLength:{value:10,message:"Please enter the max length 10"},pattern:{value:/^[0-9]*$/,message:"Please enter the valid mobile number"}}}
                            disable={appointmentEditData}
                        /> 
                </Grid>

                <Grid xs={12} sm={4}>
                   <Controller
                        name="visitType"
                        control={control}
                        rules={{ required: 'Visit type is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete
                        onChange={onChange}
                        lable={"Visit Type"}
                        value={value}
                        getOptionLabel={(option)=>`${option?.shaw}`}
                        options={VisitTypeData}
                        inputRef={ref}
                        hasError={error}
                        /> 
                        }}
                        > 
                    </Controller>
                </Grid>

                <Grid xs={12} sm={4} >
                       {
                         !appointmentEditData && <CustomButton fullWidth buttonText={"Search Registration"} startIcon={<SearchIcon/>} onClick={()=>setSeachRegistrationModal(true)}></CustomButton>
                       }
                </Grid>

                {
                          newRegistrationForm && 
                         <> <Typography  variant="h5"  style={{width:"100%"}} mb={3} mt={1}  textAlign={"center"}   >  {RegistrationNumberFound ? "Old Registration Details" : "New Registration Form" } </Typography> 
                            <Grid  
                          container
                          sm={12}
                          spacing={{ md:3 ,xs:2  }}
                          // columns={{ xs: 4, sm: 8, md: 12 }}
                          justifyContent="space-between"
                          alignItems="center"  >

                            <Grid xs={12} sm={4}>
                              <Controller
                                  name="title"
                                  control={control}
                                  rules={{ required:{value:true,message:"Patition Title is required"} }}
                                  render={({ field,fieldState:{error} }) => {
                                      const {onChange,value,ref} = field; 
                                  return <CustomAutoCompelete 
                                  onChange={onChange}
                                  lable={"Select Patition Title"}
                                  value={value}
                                  getOptionLabel={(option)=>option?.userTitle}
                                  url={"admin/addMaster/title"}
                                  filterOnActive={true}
                                  inputRef={ref}
                                  hasError={error}
                                  readOnly={RegistrationNumberFound}
                                  isOptionEqualToValue={(op,val) => op?._id==val?._id}
                                  /> 
                                  }}
                                  > 
                              </Controller>

                                  {
                                      errors.title && <Typography variant="caption" color="error">Patition Title is required</Typography> 
                                  }
                            </Grid>

                            <Grid xs={12} sm={4}>
                         <CustomTextInputField 
                           name={"pationName"}
                           control={control}
                           label={"Patition Name"}
                           rules={{required:{value:true,message:"Patiton Name is required"}}}
                            inputPropsText={{readOnly:RegistrationNumberFound}}
                         /> 
                            </Grid>

                            <Grid xs={12} sm={4}>
                         <CustomDatePickerField 
                           key={"registration"}
                           name={"dob"}
                           control={control}
                           label={"Date of birth"}
                           rules={{valueAsDate:true,required:{value:true,message:"Please enter the dob"}}}
                           maxDate={TodayDate}
                           inputProps={{readOnly:RegistrationNumberFound}}
                           />
                            </Grid>

                            <Grid xs={12} sm={4}>
                           <CustomTextInputField 
                               name={"age"}
                               type={"number"}
                               control={control}
                               label={"Age"}
                               rules={{required:{value:true,message:"Please enter the age"}}}
                            inputPropsText={{readOnly:RegistrationNumberFound}}
                           /> 
                            </Grid>

                            <Grid xs={12} sm={4}>
                           <Controller
                               name="gender"
                               control={control}
                               rules={{ required: 'Gender is required' }}
                               render={({ field,fieldState:{error} }) => {
                                   const {onChange,value,ref} = field; 
                               return <CustomAutoCompelete 
                               onChange={onChange}
                               lable={"Select Gender"}
                               value={value}
                               getOptionLabel={(option)=>option?.gender}
                               readOnly={RegistrationNumberFound}
                               options={[
                                   { gender: "male" },
                                   { gender: "female" },
                                   { gender: "other" },
                                   { gender: "non-binary" },
                                   { gender: "prefer not to say" }
                               ]
                               }
                               inputRef={ref}
                               hasError={error}
                               /> 
                               }}

                               > 
                               </Controller>

                               {
                                   errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography> 
                               }
                            </Grid>

                            <Grid xs={12} sm={4}>
                         <CustomTextInputField 
                             name={"address"}
                             control={control}
                             label={"Address"}
                             inputPropsText={{readOnly:RegistrationNumberFound}}
                             rules={{required:{value:!RegistrationNumberFound
                             ,message:"Please enter the address"}}}
                         /> 
                            </Grid> 

                            <Grid xs={12} sm={4}>
                     <Controller
                         name="city"
                         control={control}
                         rules={{ required: 'City is required' }}
                         render={({ field,fieldState:{error} }) => {
                             const {onChange,value,ref} = field; 
                         return <CustomAutoCompelete 
                         onChange={onChange}
                         lable={"Select City"}
                         readOnly={RegistrationNumberFound}
                         value={value}
                         getOptionLabel={(option)=>option?.cityName}
                         url={"admin/regionMaster/city"}
                         filterOnActive={true}
                         inputRef={ref}
                         hasError={!!error}
                        isOptionEqualToValue={(op,val) => op?._id==val?._id}
                         /> 
                         }}

                         > 
                         </Controller>
                       {
                             errors.city && <Typography variant="caption" color="error">City is required</Typography> 
                       }
                            </Grid>

                            <Grid xs={12} sm={4}>
                              <CustomTextInputField 
                                  name={"otherRemarks"}
                                  control={control}
                                  label={"Other Remarks"}
                                  inputPropsText={{readOnly:RegistrationNumberFound}}
                              /> 
                            </Grid>

                            <Grid xs={0} sm={4} />
                            
                            </Grid>

                          </>
                      }
            </Grid>

          </Box>
      </AddEditModal>

      <SearchRegistration setSeachRegistrationModal={setSeachRegistrationModal} SeachRegistrationModal={SeachRegistrationModal} setFormDataBySearch={setRegistrationModalData} setSomeSearchDataInForm={setSomeSearchDataInForm}/> 

      <TableMainBox
           title={`Appointment Master`}
            buttonText={`Add Appointment`}
            onClick={() => {setModalOpen(true);clearErrors();}}
            >
           { ListLoading ? <><LinearProgress /><TableSkeleton/></>: Array.isArray(rowData) && rowData.length > 0 ? (
                  <DataGrid
                  style={{maxHeight:`calc(100vh - 173px)`}}
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
                    classes={{cellContent:"cellContent"}}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(data) => onPaginationChange(data)}
                    rowCount={appointmentCount}
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

export default Appointment