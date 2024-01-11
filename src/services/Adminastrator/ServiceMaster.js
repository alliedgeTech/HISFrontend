import toast from 'react-hot-toast'
import { useDispatch, useSelector } from "react-redux";
import APIManager from '../../utils/ApiManager';
import { useEffect, useState } from 'react';
import { setServiceCount, setServiceCountIncByOne, setServiceData, setServiceLoading } from '../../slices/service.slice';

const ApiManager = new APIManager();

export const useServiceData = () => {
    const [listLoading, setListLoading] = useState(false);
    const dispatch = useDispatch();
    const {serviceData,servicePagination:paginationModel} = useSelector(state => state.service);
    const getServiceData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
        withLoading && setListLoading(true);
        const resData = await ApiManager.get(`admin/serviceMaster?page=${page}&pageSize=${pageSize}`);
        if(!resData.error) {
            dispatch(setServiceData(resData.data.data));
            dispatch(setServiceCount(resData.data.count));
            withLoading && setListLoading(false);
            return true;
        }

        withLoading && setListLoading(false);
        return false;
    }


    const updateServiceData =async (data,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
        const toastId = toast.loading("Loading...");
        dispatch(setServiceLoading(true));
        const resData = await ApiManager.patch(`admin/serviceMaster/${data._id}`,data);

        if(!resData.error)
        {
            const tempData = structuredClone(serviceData);
            tempData[data.id] = resData.data.data;
            dispatch(setServiceData(tempData));
            toast.dismiss(toastId)
            toast.success(resData.message);
            dispatch(setServiceLoading(false));
            return true;    
        }

        toast.dismiss(toastId);
        dispatch(setServiceLoading(false));
        return false;
    }


    const createService = async (data,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
        const toastId = toast.loading("Loading...");
        dispatch(setServiceLoading(true));
        const resData = await ApiManager.post(`admin/serviceMaster`,data);

        if(!resData.error)
        {
            if(Number.isNaN(serviceData?.length) || page*pageSize+pageSize > serviceData?.length) {
                getServiceData(false,page,pageSize);
            } else {
                dispatch(setServiceCountIncByOne());
            }

            toast.dismiss(toastId)
            toast.success(resData.message);
            dispatch(setServiceLoading(false));
            return true;    
        }

        toast.dismiss(toastId);
        dispatch(setServiceLoading(false));
        return false;
    }

    useEffect(() =>{
        !serviceData && getServiceData(true);
    },[])

    return {
        getServiceData,
        updateServiceData,
        createService,
        listLoading
    }
}