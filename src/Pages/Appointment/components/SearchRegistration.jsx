import React, { useEffect, useState } from 'react'
import APIManager from '../../../utils/ApiManager';
import { useForm,Controller } from 'react-hook-form';
import AddEditModal from '../../../Components/AddEditModal/AddEditModal';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CustomAutoCompelete from '../../../Components/CustomAutoCompelete/CustomAutoCompelete';
import { Autocomplete, TextField } from '@mui/material'

function SearchRegistration({SeachRegistrationModal,setSeachRegistrationModal,setFormDataBySearch,setSomeSearchDataInForm}) {

    var { handleSubmit, formState: { errors },reset,control,clearErrors,watch,setValue } = useForm({
        defaultValues: {
            searchBy:'doctor',
            searchValue:null
        },
        mode:'onTouched'
      });
    const watchSearchBy = watch('searchBy');
    const [RegistrationOptions, setRegistrationOptions] = useState([]);
    const [SearchRegistrationTempValue, setSearchRegistrationTempValue] = useState(false);

    const ApiManager = new APIManager();

    const searchRegistration = async() => {

        const data = await ApiManager.get(`admin/frontOffice/registration/d/t/${watchSearchBy}?searchValue=${SearchRegistrationTempValue}`);

            if(!data.error)
            {
              console.log('this is data of search registration ',data?.data?.data);
              setRegistrationOptions(data?.data?.data);

            } else {
              console.log('error while search registration ',errors?.message);
            }
      }

      useEffect(() => {
        if (SearchRegistrationTempValue?.length > 2) {
          const timeoutId = setTimeout(() => {
            searchRegistration();
          }, 800);

          return () => clearTimeout(timeoutId);
        }
      },[SearchRegistrationTempValue])

    const closeTheSearchModal = () => {
        setSeachRegistrationModal(false);
        setValue("searchBy","doctor");
        setValue("searchValue",null);
        setRegistrationOptions([]);
      }

      const submitSearchData = async(data) => {
        setFormDataBySearch(data?.searchValue?._id);
        setSomeSearchDataInForm({doctor:{...data.searchValue.doctor},mobileNo:data?.searchValue?.mobileNo});
        closeTheSearchModal();
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
                <Grid xs={12} sm={4}>
                  <Controller
                        name="searchBy"
                        control={control}
                        rules={{ required: 'searchBy is required' }}
                        render={({ field,fieldState:{error} }) => {
                            const {onChange,value,ref} = field; 
                        return <CustomAutoCompelete 
                        onChange={onChange}
                        lable={"Select searchBy"}
                        value={value}
                        getOptionLabel={(option)=>option}
                        options={['doctor','date']}
                        inputRef={ref}
                        hasError={error}
                        /> 
                        }}
                        > 
                    </Controller>
                </Grid>

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
                            label={"Select Registration"}
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

                   
                </Grid>
            </Grid>

         </Box>
    </AddEditModal>

  )
}

export default SearchRegistration