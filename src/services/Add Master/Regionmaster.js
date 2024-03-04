import APIManager from "../../utils/ApiManager"
import { useDispatch, useSelector } from "react-redux";
import { setCityCount, setCityCountIncByOne, setCityData, setCityListLoading, setCityLoading, setCountryCount, setCountryCountIncByOne, setCountryData, setCountryListLoading, setCountryLoading, setStateCount, setStateCountIncByOne, setStateData, setStateListLoading, setStateLoading } from "../../slices/region.slice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { setUserData } from "../../slices/user.slice";
import { setBranchData, setBranchEmptyData } from "../../slices/branch.slice";
import { setRegistrationEmptyData } from "../../slices/registration.slice";

const ApiManager = new APIManager();

export const useRegionData = () => {
    const dispatch = useDispatch();
    const { countryLoading,countryData,countryEditData,countryPagination,countryCount,stateData,stateLoading,stateEditData,statePagintion,stateCount,cityData,cityLoading,cityEditData,cityPagination,cityCount,countryListLoading:ListLoadingCountry,stateListLoading:ListLoadingState,cityListLoading:ListLoadingCity } = useSelector((state) => state.region);

    // const [ListLoadingCountry, setListLoadingCountry] = useState(false);
    // const [ListLoadingState, setListLoadingState] = useState(false);
    // const [ListLoadingCity, setListLoadingCity] = useState(false);

    const createCountry = async (data) => {
        dispatch(setCountryLoading(true));
        const resData = await ApiManager.post(`admin/regionMaster/country`,data);
        if(!resData?.error)
        {   
            const { page,pageSize } = countryPagination;
            toast.success("country created successfully")
            dispatch(setCountryLoading(false));
            if(Number.isNaN(countryData?.length) || page*pageSize+pageSize > countryData?.length) {
                getAllCountry();
            } else {
                dispatch(setCountryCountIncByOne());
            }
            return true;
        }
        dispatch(setCountryLoading(false));
        return false;
    }

    const getAllCountry = async (withLoading=false,page=countryPagination?.page,pageSize=countryPagination?.pageSize) => {
        if(withLoading) 
        {
            dispatch(setCountryListLoading(true));
        }
        const resData = await ApiManager.get(`admin/regionMaster/country?page=${page}&pageSize=${pageSize}`);
        if(!resData?.error)
        {
            console.log('this is count : resData',resData)
            dispatch(setCountryData(resData?.data?.data));
            dispatch(setCountryCount(resData?.data?.count));
            if(withLoading) {dispatch(setCountryListLoading(false))};
            return true;    
        }
        if(withLoading){
            dispatch(setCountryListLoading(false));
        }
        return false;
    }

    const updateCountry = async (data) => {
        dispatch(setCountryLoading(true));
        const resData = await ApiManager.patch(`admin/regionMaster/country/${data._id}`,data);
        if(!resData?.error)
        {
            toast.success("country updated successfully")
            dispatch(setUserData(null));
            getAllCountry();
            getAllState();
            getAllCity();
            dispatch(setCountryLoading(false));
            return true;
        }
        dispatch(setCountryLoading(false));
        return false;
    
    }

    const createState = async (data) => {
        dispatch(setStateLoading(true));
        const resData = await ApiManager.post("admin/regionMaster/state",data);
        if(!resData?.error)
        {
            dispatch(setStateLoading(false));
            const { page,pageSize } = statePagintion;
            if(Number.isNaN(stateData?.length) || page*pageSize+pageSize > stateData?.length) {
                getAllState();
            } else { 
                dispatch(setStateCountIncByOne());
            }
            toast.success("state created successfully")
            return true;
        }
        dispatch(setStateLoading(false));
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
        if(tempData?.isActive?.toString()!==data?.isActive)
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
            dispatch(setRegistrationEmptyData());
            dispatch(setStateLoading(false));
            return true;
        } 

        dispatch(setStateLoading(false));
        return false;
    }

    const getAllState = async (withLoading=false,page=statePagintion?.page,pageSize=statePagintion?.pageSize) => {
        if(withLoading) 
        {
            dispatch(setStateListLoading(true));
        }
        const resData = await ApiManager.get(`admin/regionMaster/state?page=${page}&pageSize=${pageSize}`);

        if(!resData?.error)
        {   
            dispatch(setStateData(resData?.data?.data));
            dispatch(setStateCount(resData?.data?.count));
            if(withLoading) {
                dispatch(setStateListLoading(false));
            };
                return true;
        }

        if(withLoading){
            dispatch(setStateListLoading(false));
        }
        return false;
    }

    const getAllCity = async (withLoading=false,page=cityPagination?.page,pageSize=cityPagination?.pageSize) => {
        if(withLoading) 
        {
            dispatch(setCityListLoading(true));
        }
        const resData = await ApiManager.get(`admin/regionMaster/city?page=${page}&pageSize=${pageSize}`);

        if(!resData?.error)
        {
            dispatch(setCityData(resData?.data?.data));
            dispatch(setCityCount(resData?.data?.count));
            if(withLoading) {
                dispatch(setCityListLoading(false));
            };
            return true;
        }
        if(withLoading) {
            dispatch(setCityListLoading(false));
        };
        return false;
    }

    const createCity = async (data) => {
        dispatch(setCityLoading(true));
        console.log("for create city : ",data);
        const tempdata = {
            cityName : data?.cityName,
            isActive : data?.isActive,
            stateId : data?.stateId,
            countryId: data?.stateName?.countryId
        }
        const resData = await ApiManager.post("admin/regionMaster/city",tempdata);
        if(!resData?.error)
        {
            toast.success("city created successfully")
            const { page,pageSize } = cityPagination;
            if(Number.isNaN(cityData?.length) || page*pageSize+pageSize > cityData?.length) {
                getAllCity();
            } else { 
                dispatch(setCityCountIncByOne());
            }
            dispatch(setCityLoading(false));
            return true;
        }
        dispatch(setCityLoading(false));
        return false;
    }

    const updateCity = async (data) => {
        dispatch(setCityLoading(true));
        let tempData = cityData[cityEditData-1];
        let formData = {};
        console.log('this is temp data',tempData,data)
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
        if(tempData?.isActive?.toString()!==data?.isActive)
        {
            formData = {
                ...formData,
                isActive : data?.isActive
            }
        }

        if(Object.keys(formData).length===0)
        {
            toast.error("in form no changes are there");
            dispatch(setCityLoading(false));
            return false;
        }

        const resData = await ApiManager.patch(`admin/regionMaster/city/${tempData._id}`,formData);

        if(!resData?.error)
        {
            toast.success("city updated successfully");
            getAllCity();
            dispatch(setBranchEmptyData());
            dispatch(setRegistrationEmptyData());
            dispatch(setBranchData(null));
            dispatch(setCityLoading(false));
            return true;
        }

        dispatch(setCityLoading(false));
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
                    getAllCountry();
                    getAllState(true);
                    getAllCity(true);
                    toast.dismiss(toastId);
                    dispatch(setCountryLoading(false));
                    toast.success("country updated successfully")
                    return true;
                    
                }
                toast.dismiss(toastId);
                dispatch(setCountryLoading(false));
                break;
            case 'state' :
                dispatch(setStateLoading(true));
                const resData1 = await ApiManager.patch(`admin/regionMaster/state`,{isActive:value,stateId:id});
                if(!resData1?.error)
                {
                    getAllState();
                    getAllCity();
                    toast.dismiss(toastId);
                    dispatch(setStateLoading(false));
                    toast.success("state updated successfully")
                    return;
                }
                toast.dismiss(toastId);
                dispatch(setStateLoading(false));
                break;
            case 'city' :
                dispatch(setCityLoading(true));
                console.log('this is city id:',id);
                const resData2 = await ApiManager.patch(`admin/regionMaster/city`,{isActive:value,cityId:id});
                if(!resData2?.error)
                {
                    getAllCity();
                    toast.dismiss(toastId);
                    dispatch(setCityLoading(false));
                    toast.success("city updated successfully")
                    return;
                }
                toast.dismiss(toastId);
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