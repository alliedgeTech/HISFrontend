import { useDispatch, useSelector } from "react-redux";
import { setRegistrationCount, setRegistrationData, setRegistrationLoading } from "../../slices/registration.slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import APIManager from "../../utils/ApiManager";

const ApiManager = new APIManager();

export const  useFrontOfficeRegistration = () => {
    const [ListLoading, setListLoading] = useState(false);

    const dispatch = useDispatch();
  const { registrationData,registrationPagination} = useSelector(State => State.registration);

  const getRegistrationData = async (withLoading=false,page=registrationPagination.page,pageSize=registrationPagination.pageSize) => {
        if(withLoading)
        {
            setListLoading(true);
        }
        const data = await ApiManager.get(`admin/frontOffice/registration?page=${page}&pageSize=${pageSize}`);
        if(!data.error)
        {
            console.log("this is count data : ",data);
            dispatch(setRegistrationCount(data?.data?.count));
            dispatch(setRegistrationData(data?.data?.data));  
            withLoading && setListLoading(false);
            return true; 
        }
        if(withLoading)
        {
            setListLoading(false);
        }
        return false;
    }

    const createRegistration = async (data) => {

        dispatch(setRegistrationLoading(true));

        // api calling
        if(data?.image)
        {
                const formData = new FormData();
                for(let i of Object.keys(data))
                {
                    formData.append(i,data[i]);   
                }
                const resData = await ApiManager.postForm(`admin/frontOffice/registration`,formData);

                if(!resData?.error)
                {
                    getRegistrationData();
                    toast.success(resData.message);
                    dispatch(setRegistrationLoading(false));
                    return true;
                } 
                dispatch(setRegistrationLoading(false));
                return false;
        }

         else
          {
            const resData = await ApiManager.post("admin/frontOffice/registration",data);

        if(!resData?.error)
        {
            getRegistrationData();
            toast.success(resData.message);   
            dispatch(setRegistrationLoading(false));
            return true;
        }

        // toast.error(resData?.message);
        dispatch(setRegistrationLoading(false));
        return false;
          }
        
    }


    const updateRegistration = async (data,image) => {
        console.log("i got this image : ",image);
        if(image)
        {
            dispatch(setRegistrationLoading(true));
            try {
                const formData = new FormData();    
                for(let i of Object.keys(data))
                {   
                    formData.append(i,data[i]);   
                }
                formData.append('image',image);
                const resData = await ApiManager.patchForm(`admin/frontOffice/registration`,formData);

                if(!resData?.error)
                {
                    getRegistrationData();
                    toast.success('registration updated successfully');
                    return true;
                }
            } catch (error) {

                // toast.error(error?.message);
                console.log("this is error current : ",error?.message);
                dispatch(setRegistrationLoading(false));
                return false;

            } finally {

                dispatch(setRegistrationLoading(false));
            }

        } else 
        {
            dispatch(setRegistrationLoading(true));

            const resData = await ApiManager.patch(`admin/frontOffice/registration`,data);

            if(!resData?.error)
            {
                getRegistrationData();
                toast.success("registration updated successfully");   
                dispatch(setRegistrationLoading(false));
                return true;
            }
            // toast.error(resData?.message);
            dispatch(setRegistrationLoading(false));
            return false;
        }
        

    }

    const updateState = async (tempData) => {
        console.log("we get it is")
        dispatch(setRegistrationLoading(true));
        console.log("this is confusing data",tempData);
        const data = await ApiManager.patch("admin/frontOffice/registration/active",{registrationId:tempData.id,isActive:tempData.value});

        if(!data.error)
        {
            getRegistrationData();
            toast.success('registration updated successfully');
            dispatch(setRegistrationLoading(false));
            return true;
        }

        // toast.error(data.message);
        dispatch(setRegistrationLoading(false));
        return false;
    }

    useEffect(() => {
        if(!registrationData) 
        {
            getRegistrationData(true);
        }
    },[]);


    return {
        getRegistrationData,
        createRegistration,
        updateRegistration,
        updateState,
        ListLoading
    }

}