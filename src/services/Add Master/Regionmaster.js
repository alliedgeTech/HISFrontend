// import { Toast } from "react-toastify/dist/components";
import APIManager from "../../utils/ApiManager"
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCityData, setCityLoading, setCountryData, setCountryDropDownData, setCountryLoading, setStateData, setStateDropDownData, setStateLoading } from "../../slices/region.slice";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';


const ApiManager = new APIManager();

export const useRegionData = () => {
    const dispatch = useDispatch();
    const { countryLoading,countryData,countryEditData,countryDropDownData,stateData,stateLoading,stateEditData,stateDropDownData,cityData,cityLoading,cityEditData, } = useSelector((state) => state.region);
    const [ListLoadingCountry, setListLoadingCountry] = useState(false);
    const [ListLoadingState, setListLoadingState] = useState(false);
    const [ListLoadingCity, setListLoadingCity] = useState(false);
    const createCountry = async (data) => {
        dispatch(setCountryLoading(true));
        const resData = await ApiManager.post("admin/regionMaster/country",data);
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

    const getAllCountry = async (withLoading=false) => {
        if(withLoading) 
        {
            setListLoadingCountry(true);
            dispatch(setCountryLoading(true));
        }
        const resData = await ApiManager.get("admin/regionMaster/country");
        if(!resData?.error)
        {
            dispatch(setCountryData(resData?.data));
            dispatch(setCountryDropDownData(resData?.data.filter((tempData)=>{ return tempData?.isActive})));
            if(withLoading) {setListLoadingCountry(false);dispatch(setCountryLoading(false))};
            return true;
        }
        if(withLoading){
            setListLoadingCountry(false);
            dispatch(setCountryLoading(false));
        }
        return false;
    }

    const updateCountry = async (data) => {
        dispatch(setCountryLoading(true));
        let temp = countryData[countryEditData-1];
        const resData = await ApiManager.patch(`admin/regionMaster/country/${temp._id}`,data);
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

    const getAllState = async (withLoading=false) => {
        if(withLoading) 
        {
            setListLoadingState(true);
            dispatch(setStateLoading(true));
        }
        const resData = await ApiManager.get("admin/regionMaster/state");

        if(!resData?.error)
        {
            let filterData = resData?.data.filter((tempData)=>(tempData?.countryId?.isActive));
            dispatch(setStateData(filterData));
            dispatch(setStateDropDownData(filterData.filter((tempData)=>{ return tempData?.isActive})));
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

    const getAllCity = async (withLoading=false) => {
        if(withLoading) 
        {
            dispatch(setCityLoading(true));
            setListLoadingCity(true);
        }
        const resData = await ApiManager.get("admin/regionMaster/city");
        if(!resData?.error)
        {
            console.log("this si data jdjsklfjsk -2",resData?.data)
            let filterData = resData?.data.filter((tempData)=>{ return (tempData?.stateId?.isActive && tempData?.stateId?.countryId?.isActive)});
            console.log('this si data jdjsklfjsk -1',filterData);
            dispatch(setCityData(filterData));
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

    const handleSwitch = async (index,value,type) => {
        const toastId = toast.loading("Loading...");
        
        switch(type) {
            case 'country' : 
                dispatch(setCountryData(true));
                let tempData = countryData[index];
                const resData = await ApiManager.patch(`admin/regionMaster/country`,{isActive:value,countryId:tempData._id});
                if(!resData?.error)
                {
                    toast.success("country updated successfully")
                    getAllCountry();
                    getAllState(true);
                    getAllCity(true);
                    toast.dismiss(toastId);
                    dispatch(setCountryLoading(false));
                    return;
                    
                }
                toast.dismiss(toastId);
                toast.error(resData?.message);
                dispatch(setCountryLoading(false));
                break;
            case 'state' :
                dispatch(setCountryData(true));
                let tempData1 = stateData[index];
                const resData1 = await ApiManager.patch(`admin/regionMaster/state`,{isActive:value,stateId:tempData1._id});
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
                let tempData2 = cityData[index];
                const resData2 = await ApiManager.patch(`admin/regionMaster/city`,{isActive:value,cityId:tempData2._id});
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
        createCountry,
        countryData,
        countryLoading,
        countryEditData,
        countryDropDownData,
        updateCountry,
        ListLoadingCountry,

        stateData,
        stateLoading,
        stateEditData,
        ListLoadingState,
        stateDropDownData,
        createState,
        updateState,

        cityData,
        ListLoadingCity,
        cityLoading,
        cityEditData,
        createCity,
        updateCity,

        handleSwitch
    }

}