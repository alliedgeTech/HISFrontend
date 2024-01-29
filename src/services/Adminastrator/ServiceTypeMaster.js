import { useEffect, useState } from "react";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { setServiceTypeCount, setServiceTypeCountIncByOne, setServiceTypeData, setServiceTypeLoading } from "../../slices/servicetype.slice";
import toast from 'react-hot-toast'
import { setServiceData, setServiceEmptyData } from "../../slices/service.slice";

const ApiManager = new APIManager();

export const useServiceTypeData = () => {
    const dispatch = useDispatch();
    const {serviceTypeData,serviceTypePagination:paginationModel} = useSelector(state => state.serviceType);
    const [ListLoading, setListLoading] = useState(false);

    const getServiceTypeData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
        if(withLoading)
        {
            setListLoading(true);
        }
        const resData = await ApiManager.get(`admin/serviceTypeMaster?page=${page}&pageSize=${pageSize}`);

        if(!resData.error){
            dispatch(setServiceTypeData(resData.data.data)); 
            dispatch(setServiceTypeCount(resData.data.count));
            withLoading && setListLoading(false);
            return true; 
        }
        if(withLoading)
        {
            setListLoading(false);
        }
        return false;
    }

    useEffect(() => {
        if(!serviceTypeData)
            getServiceTypeData(true,0,10);
        },[]);

    const updateServiceTypeData =async (data,page,pageSize) => {

            const toastId = toast.loading("Loading...");
            dispatch(setServiceTypeLoading(true));
            const resData = await ApiManager.patch(`admin/serviceTypeMaster/${data._id}`,data);
    
            if(!resData.error)
            {
                const tempData = structuredClone(serviceTypeData);
                tempData[data.id] = resData.data.data;
                dispatch(setServiceTypeData(tempData));
                dispatch(setServiceEmptyData());
                toast.dismiss(toastId)
                toast.success(resData.message);
                dispatch(setServiceTypeLoading(false));
                return true;    
            }
    
            toast.dismiss(toastId);
            dispatch(setServiceTypeLoading(false));
            return false;
        }


    const createServiceType = async (data,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
        dispatch(setServiceTypeLoading(true));
        const toastId = toast.loading("Loading...");
        const resData = await ApiManager.post("admin/serviceTypeMaster",data);
        if(!resData.error)
        {
            console.log('this is we are done the work',Number.isNaN(serviceTypeData?.length),page*pageSize+pageSize > serviceTypeData?.length)
            if( Number.isNaN(serviceTypeData?.length) || page*pageSize+pageSize > serviceTypeData?.length) {
                getServiceTypeData(false,page,pageSize);
            } else {
                dispatch(setServiceTypeCountIncByOne())
            }
            toast.dismiss(toastId)
            toast.success(resData.message);
            dispatch(setServiceTypeLoading(false));
            return true;
        }

        toast.dismiss(toastId);
            dispatch(setServiceTypeLoading(false));
        return false;
    }

    return {
        getServiceTypeData,
        updateServiceTypeData,
        createServiceType,
        ListLoading
    }
}