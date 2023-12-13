// import { Toast } from "react-toastify/dist/components";
import APIManager from "../../utils/ApiManager"
import { useDispatch, useSelector } from "react-redux";
import { setCityCount, setCityData, setCityLoading, setCountryCount, setCountryData, setCountryLoading, setStateCount, setStateData, setStateLoading } from "../../slices/region.slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ApiManager = new APIManager();

export const useRegionData = () => {
    const dispatch = useDispatch();
    const { countryLoading,countryData,countryEditData,countryPagination,countryCount,stateData,stateLoading,stateEditData,statePagintion,stateCount,cityData,cityLoading,cityEditData,cityPagination,cityCount } = useSelector((state) => state.region);

    const [ListLoadingCountry, setListLoadingCountry] = useState(false);
    const [ListLoadingState, setListLoadingState] = useState(false);
    const [ListLoadingCity, setListLoadingCity] = useState(false);

    const createCountry = async (data) => {
        dispatch(setCountryLoading(true));
        const resData = await ApiManager.post(`admin/regionMaster/country`,data);
        if(!resData?.error)
        {
            toast.success("country created successfully")
            dispatch(setCountryLoading(false));
            getAllCountry();
            return true;
        }
        dispatch(setCountryLoading(false));
        toast.error(resData?.message)
        return false;
    }

    const getAllCountry = async (withLoading=false,page=countryPagination?.page,pageSize=countryPagination?.pageSize) => {
        if(withLoading) 
        {
            setListLoadingCountry(true);
        }
        const resData = await ApiManager.get(`admin/regionMaster/country?page=${page}&pageSize=${pageSize}`);
        if(!resData?.error)
        {
            console.log('this is count : resData',resData)
            dispatch(setCountryData(resData?.data?.data));
            dispatch(setCountryCount(resData?.data?.count));
            if(withLoading) {setListLoadingCountry(false)};
            return true;    
        }
        if(withLoading){
            setListLoadingCountry(false);
        }
        return false;
    }

    const updateCountry = async (data) => {
        dispatch(setCountryLoading(true));
        const resData = await ApiManager.patch(`admin/regionMaster/country/${data._id}`,data);
        if(!resData?.error)
        {
            toast.success("country updated successfully")
            getAllCountry();
            getAllState();
            getAllCity();
            dispatch(setCountryLoading(false));
            return true;
        }
        dispatch(setCountryLoading(false));
        toast.error(resData?.message)
        return false;
    
    }

    const createState = async (data) => {
        dispatch(setStateLoading(true));
        const resData = await ApiManager.post("admin/regionMaster/state",data);
        if(!resData?.error)
        {
            dispatch(setStateLoading(false));
            getAllState();
            toast.success("state created successfully")
            return true;
        }
        dispatch(setStateLoading(false));
        toast.error(resData?.message)
        return false;
    }

    const updateState = async (data,index) => {
        dispatch(setStateLoading(true));
        let formData = {};
        let tempData = stateData[index-1];
        if(tempData?.countryId?._id!==data?.countryName?._id)
        {
            formData = {
                countryId : data?.countryName?._id
            }
        }
        if(tempData?.stateName!==data?.stateName)
        {
            formData = {
                ...formData,
                stateName : data?.stateName
            }
        }
        if(tempData?.isActive!==data?.isActive)
        {
            formData = {
                ...formData,
                isActive : data?.isActive
            }
        }

        if(Object.keys(formData).length===0)
        {
            toast.error("in form no changes are there");
            dispatch(setStateLoading(false));
            return false;
        }

        const resData = await ApiManager.patch(`admin/regionMaster/state/${tempData._id}`,formData);

        if(!resData?.error)
        {
            toast.success("state updated successfully")
            getAllState();
            getAllCity();
            dispatch(setStateLoading(false));
            return true;
        } 

        dispatch(setStateLoading(false));
        toast.error(resData?.message)
        return false;
    }

    const getAllState = async (withLoading=false,page=statePagintion?.page,pageSize=statePagintion?.pageSize) => {
        if(withLoading) 
        {
            setListLoadingState(true);
            dispatch(setStateLoading(true));
        }
        const resData = await ApiManager.get(`admin/regionMaster/state?page=${page}&pageSize=${pageSize}`);

        if(!resData?.error)
        {
            dispatch(setStateData(resData?.data?.data));
            dispatch(setStateCount(resData?.data?.count));
            if(withLoading) {
                setListLoadingState(false);
                dispatch(setStateLoading(false))};
            return true;
        }

        if(withLoading){
            setListLoadingState(false);
            dispatch(setStateLoading(false));
        }
        return false;
    }

    const getAllCity = async (withLoading=false,page=cityPagination?.page,pageSize=cityPagination?.pageSize) => {
        if(withLoading) 
        {
            dispatch(setCityLoading(true));
            setListLoadingCity(true);
        }
        const resData = await ApiManager.get(`admin/regionMaster/city?page=${page}&pageSize=${pageSize}`);

        if(!resData?.error)
        {
            dispatch(setCityData(resData?.data?.data));
            dispatch(setCityCount(resData?.data?.count));
            if(withLoading) {
                dispatch(setCityLoading(false));
                setListLoadingCity(false);
            };
            return true;
        }
        if(withLoading) {
            dispatch(setCityLoading(false))
            setListLoadingCity(false);
        };
        return false;
    }

    const createCity = async (data) => {
        dispatch(setCityLoading(true));
        const resData = await ApiManager.post("admin/regionMaster/city",data);
        if(!resData?.error)
        {
            toast.success("city created successfully")
            getAllCity();
            dispatch(setCityLoading(false));
            return true;
        }
        dispatch(setCityLoading(false));
        toast.error(resData?.message)
        return false;
    }

    const updateCity = async (data) => {
        dispatch(setCityLoading(true));
        let tempData = cityData[cityEditData-1];
        let formData = {};
        if(tempData?.cityName!==data?.cityName)
        {
            formData = {
                cityName : data?.cityName
            }
        }
        if(tempData?.stateId?._id!==data?.stateName?._id)
        {
            formData = {
                ...formData,
                stateId : data?.stateName?._id
            }
        }
        if(tempData?.isActive!==data?.isActive)
        {
            formData = {
                ...formData,
                isActive : data?.isActive
            }
        }

        if(Object.keys(formData).length===0)
        {
            toast.error("in form no changes are there");
            return false;
        }

        const resData = await ApiManager.patch(`admin/regionMaster/city/${tempData._id}`,formData);

        if(!resData?.error)
        {
            toast.success("city updated successfully")
            getAllCity();
            dispatch(setCityLoading(false));
            return true;
        }

        dispatch(setCityLoading(false));
        toast.error(resData?.message);
        return false;
    }

    const handleSwitch = async (id,value,type) => {
        const toastId = toast.loading("Loading...");
        
        switch(type) {
            case 'country' : 
                dispatch(setCountryLoading(true));
                const resData = await ApiManager.patch(`admin/regionMaster/country`,{isActive:value,countryId:id});
                if(!resData?.error)
                {
                    toast.success("country updated successfully")
                    getAllCountry();
                    getAllState(true);
                    getAllCity(true);
                    toast.dismiss(toastId);
                    dispatch(setCountryLoading(false));
                    return true;
                    
                }
                toast.dismiss(toastId);
                toast.error(resData?.message);
                dispatch(setCountryLoading(false));
                break;
            case 'state' :
                dispatch(setStateLoading(true));
                const resData1 = await ApiManager.patch(`admin/regionMaster/state`,{isActive:value,stateId:id});
                if(!resData1?.error)
                {
                    toast.success("state updated successfully")
                    getAllState();
                    getAllCity();
                    toast.dismiss(toastId);
                    dispatch(setStateLoading(false));
                    return;
                }
                toast.dismiss(toastId);
                toast.error(resData1?.message);
                dispatch(setStateLoading(false));
                break;
            case 'city' :
                dispatch(setCityLoading(true));
                const resData2 = await ApiManager.patch(`admin/regionMaster/city`,{isActive:value,cityId:id});
                if(!resData2?.error)
                {
                    toast.success("city updated successfully")
                    getAllCity();
                    toast.dismiss(toastId);
                    dispatch(setCityLoading(false));
                    return;
                }
                toast.dismiss(toastId);
                toast.error(resData2?.message);
                dispatch(setCityLoading(false));
                break;
            default:
                console.log("Please enter valid type");
        }

    } 
    
    useEffect(()=>{
        if(!countryData) 
        getAllCountry(true);
        if(!stateData)
        getAllState(true);
        if(!cityData)
        getAllCity(true);
    },[]);



    return {
        getAllCountry,
        createCountry,
        countryData,
        countryLoading,
        countryEditData,
        updateCountry,
        ListLoadingCountry,
        countryPagination,
        countryCount,

        getAllState,
        stateData,
        stateLoading,
        stateEditData,
        ListLoadingState,
        createState,
        updateState,
        statePagintion,
        stateCount,

        getAllCity,
        cityData,
        ListLoadingCity,
        cityLoading,
        cityEditData,
        createCity,
        updateCity,
        cityPagination,
        cityCount,

        handleSwitch
    }

}