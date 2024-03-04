import { useDispatch, useSelector } from "react-redux";
import { setTarrifWithServiceCount, setTarrifWithServiceCountIncByOne, setTarrifWithServiceData, setTarrifWithServiceListLoading, setTarrifWithServiceLoading } from "../../slices/tarrif.slice";
import { useEffect, useState } from "react";
import APIManager from "../../utils/ApiManager";
import toast from 'react-hot-toast';

const ApiManager = new APIManager();
export const useTarrifWithServiceData = () => {
    

    const  { tarrifWithServiceData,tarrifWithServicePagination:paginationModel } =  useSelector(state => state.tarrif);
    const dispatch = useDispatch();
    const getTarrifWithServiceData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pageSize) => {
            withLoading && dispatch(setTarrifWithServiceListLoading(true));
            const resData = await ApiManager.get(`admin/addMaster/tarrifWithService?page=${page}&pageSize=${pageSize}`);     

            if(!resData.error){
                dispatch(setTarrifWithServiceData(resData.data.data)); 
                dispatch(setTarrifWithServiceCount(resData.data.count));
                withLoading && dispatch(setTarrifWithServiceListLoading(false));
                return true; 
            }
            withLoading && dispatch(setTarrifWithServiceListLoading(false));
            return false;
    }

    const createTarrifWithServiceData = async (data) => {
        
        dispatch(setTarrifWithServiceLoading(true));

        const resData = await ApiManager.post(`admin/addMaster/tarrifWithService`,data);   

            if(!resData.error){
                const { page,pageSize } = paginationModel;

                if(Number.isNaN(tarrifWithServiceData?.length) || page*pageSize+pageSize > tarrifWithServiceData?.length) {
                    getTarrifWithServiceData();
                } else {
                    dispatch(setTarrifWithServiceCountIncByOne());
                }

                dispatch(setTarrifWithServiceLoading(false));
                toast.success("tarrif with service created successfully");
                return true;
            }
        dispatch(setTarrifWithServiceLoading(false));
        return false;
    }


    const updateTarrifWithServiceData = async (data) => {
        dispatch(setTarrifWithServiceLoading(true));

        const resData = await ApiManager.patch(`admin/addMaster/tarrifWithService/${data._id}`,data);

        if(!resData.error)
        {
            const temp = structuredClone(tarrifWithServiceData);
            console.log("this is tmep #",data?.id,data);
            temp[data?.id] = resData.data.data;
            console.log("this is temp #",temp)
            dispatch(setTarrifWithServiceData(temp));
            toast.success("tarrif with service created successfully");
            dispatch(setTarrifWithServiceLoading(false));
            return true;
        }
        dispatch(setTarrifWithServiceLoading(false));
        return false;

    }

    useEffect(() => {
        !tarrifWithServiceData && getTarrifWithServiceData(true);
    },[]);

    return {
        getTarrifWithServiceData,
        createTarrifWithServiceData,
        updateTarrifWithServiceData,
    }
}