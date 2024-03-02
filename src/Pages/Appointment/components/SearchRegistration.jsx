import React, { useEffect, useState } from 'react'
import APIManager from '../../../utils/ApiManager';
import { useForm,Controller } from 'react-hook-form';
import AddEditModal from '../../../Components/AddEditModal/AddEditModal';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import { Autocomplete, TextField } from '@mui/material'
import CustomDatePickerField from '../../../Components/InputsFilelds/CustomDatePickerField';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';

function SearchRegistration({SeachRegistrationModal,setSeachRegistrationModal,setFormDataBySearch,setSomeSearchDataInForm}) {

    var { handleSubmit, formState: { errors },reset,control,clearErrors,watch,setValue } = useForm({
        defaultValues: {
            searchBy:'doctor',
            searchValue:null,
            date:'',
            mobileNo:''
        },
        mode:'onTouched'
      });
    const watchSearchBy = watch('searchBy');
    const watchSearchMobileNo = watch('mobileNo');
    const [RegistrationOptions, setRegistrationOptions] = useState([]);
    const [SearchRegistrationTempValue, setSearchRegistrationTempValue] = useState(false);
    const [Loading, setLoading] = useState(false)
    const DateTempValue = watch('date');
    const ApiManager = new APIManager();

    const searchRegistration = async() => {
      setLoading(true);
        const data = await ApiManager.get(`admin/frontOffice/registration/d/t/${watchSearchBy}?searchValue=${SearchRegistrationTempValue}`);

            if(!data.error)
            {
              console.log('this is data of search registration ',data?.data?.data);
              setRegistrationOptions(data?.data?.data);

            } else {
              console.log('error while search registration ',errors?.message);
            }
        setLoading(false);
      }
    
    const searchRegistrationByDate = async() => {
      setLoading(true);
      const data = await ApiManager.get(`admin/frontOffice/registration/d/t/${watchSearchBy}?searchValue=${dayjs(DateTempValue?.$d)?.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")}`);

        if(!data.error)
        {
          console.log('this is data of search registration ',data?.data?.data);
          setRegistrationOptions(data?.data?.data);

        } 
        setLoading(false);
      } 

    const searchRegistrationByMobileNo = async() => {
      setLoading(true);
      const data = await ApiManager.get(`admin/frontOffice/registration/m/${watchSearchMobileNo}`);

        if(!data.error)
        {
          console.log('this is data of search registration ',data?.data?.data);
          setRegistrationOptions(data?.data?.data);

        } 
        setLoading(false);
      } 



      useEffect(() => {
        let timeoutId;
        if(watchSearchBy === 'doctor')
        {
          if (SearchRegistrationTempValue?.length > 2) {
             timeoutId = setTimeout(() => {
              searchRegistration();
            }, 800);  
        }
          return () => clearTimeout(timeoutId);
        }
      },[SearchRegistrationTempValue])

      useEffect(() => {
        if (DateTempValue) {
          const timeoutId = setTimeout(() => {
            searchRegistrationByDate();
          }, 800);

          return () => clearTimeout(timeoutId);
        }
      },[DateTempValue])

      useEffect(()=> {
        if (watchSearchMobileNo?.length > 2) {
          const timeoutId = setTimeout(() => {
            searchRegistrationByMobileNo();
          }, 800);

          return () => clearTimeout(timeoutId);
        }
      },[watchSearchMobileNo])
  

    const closeTheSearchModal = () => {
        setSeachRegistrationModal(false);
        reset({
          searchBy:'doctor',
          searchValue:null,
          date:''
        })
        setRegistrationOptions([]);
    }

      const submitSearchData = async(data) => {
        setFormDataBySearch(data?.searchValue?._id);
        console.log("this is data searched : ",data);
        setSomeSearchDataInForm({doctor:{...data.searchValue.doctor},mobileNo:data?.searchValue?.mobileNo,email:data?.searchValue?.email});
        closeTheSearchModal();
     }

     const SearchByChange = (value) => {
      if(value === 'doctor')
      {
        setValue("date",'');   
        setValue("mobileNo",'');     
      } else if(value === 'date') {
        setValue("mobileNo",'');      
      } else if(value === 'mobileNo') {
        setValue("date",'');
      }
     }

  return (
    <AddEditModal
         maxWidth="md"
         handleClose={closeTheSearchModal}
         handleSubmit={handleSubmit(submitSearchData)}
         open={SeachRegistrationModal}
         modalTitle={'Search Registration'}
         ButtonText={"Choose Registration"}
        //  Loading={appointmentLoading}
      >
         <Box
          component="form"
          onSubmit={handleSubmit(submitSearchData)}
          p={3}
          >
            <Grid   
                container
                spacing={{ md:3 ,xs:2  }}
                // columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="space-between"
                alignItems="center" 
              >   
                <Grid xs={12} sm={6}>
                  <Controller
                        name="searchBy"
                        control={control}
                        rules={{ required: 'searchBy is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete 
                        onChange={(e,values)=>{onChange(e,values);SearchByChange(values)}}
                        lable={"Select searchBy"}
                        value={value}
                        getOptionLabel={(option)=>option}
                        options={['doctor','date','mobileNo']}
                        inputRef={ref}
                        hasError={error}
                        /> 
                        }}
                        > 
                    </Controller>
                </Grid>

                {
                  watchSearchBy === 'date' && <Grid xs={12} sm={6}>
                  <CustomDatePickerField 
                  key={"search registration date"}
                  name={"date"}
                  control={control}
                  label={"Select Date"}
                  maxDate={new Date()}
                  rules={{valueAsDate:true}}
                  />
                </Grid>
                }

                <Grid xs={12} sm={12}>
                    <Controller
                        name="searchValue"
                        control={control}
                        rules={{ required: 'registration is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref,onBlur} = field; 
                            console.log("value is this",value);
                        return  <Autocomplete
                        clearOnEscape
                        autoComplete
                        loading={Loading}
                        // autoHighlight
                        blurOnSelect
                        clearOnBlur
                        options={RegistrationOptions}
                        value={watch('searchValue')} 
                        // onBlur={onBlur}
                        onChange={(e,s) => {
                            onChange(e);
                            console.log('this is op Selected Option:', e,s);
                            setValue("searchValue",s);
                         }}
                        renderInput={(params) => (
                          <TextField
                            {...params} 
                            sx={{
                              "& label.Mui-focused": {
                                color: error ? "" : "#25396f",
                              },
                              "& .MuiOutlinedInput-root": {
                                "&.Mui-focused fieldset": {
                                  borderColor: error ? "" : "#25396f",
                                },
                              },
                            }}
                            label={ watchSearchBy==='date' ? "Select Registration" : 'Enter Doctor Name'}
                            inputRef={ref}
                            onChange={(e)=>{
                              setSearchRegistrationTempValue(e.target.value);
                            }}
                            error={!!error}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => {console.log("this is op",option,"and value : ",value) ; return option?.id === value?.id}}
                        getOptionLabel={(op)=>( `${op?.doctor?.userName} / ${op?.pationName} / ${op?.city?.cityName} / ${op?.dob?.slice(0,10)} / ${op?.mobileNo}`)}
                      />
                      }}
                    > 
                    </Controller>
                    <Typography mt={1} ml={1} variant="caption" display="block" gutterBottom>Please enter min 3 char</Typography>
                </Grid>

                
            </Grid>

         </Box>
    </AddEditModal>

  )
}

export default SearchRegistration