import { useEffect, useState } from "react";
import { setTarrifCount, setTarrifCountIncByOne, setTarrifData, setTarrifLoading } from "../../slices/tarrif.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast'
const ApiManager = new APIManager();

export const useTarrifData = () => {

    const {tarrifData,tarrifPagination:paginationModel} = useSelector(state => state.tarrif);
    const dispatch = useDispatch();
    const [listLoading, setListLoading] = useState(false);

    const getTarrifData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pageSize) => {

        if(withLoading)
        {
            setListLoading(true);
        }

        const resData = await ApiManager.get(`admin/addMaster/tarrifMaster?page=${page}&pageSize=${pageSize}`);

        if(!resData.error){
            dispatch(setTarrifData(resData.data.data)); 
            dispatch(setTarrifCount(resData.data.count));
            withLoading && setListLoading(false);
            return true; 
        }

        if(withLoading)
        {
            setListLoading(false);
        }

        return false;
    }

    const createTarrifData = async (data,resetAll) => { 

        dispatch(setTarrifLoading(true));
        const resData = await ApiManager.post(`admin/addMaster/tarrifMaster`,data);   

            if(!resData.error){
                resetAll();
                const { page,pageSize } = paginationModel;
                if(Number.isNaN(tarrifData?.length) || page*pageSize+pageSize > tarrifData?.length) {
                    getTarrifData();
                } else {
                    dispatch(setTarrifCountIncByOne());
                }
                dispatch(setTarrifLoading(false));
                return true;
            }
        dispatch(setTarrifLoading(false));
            return false;
    }


    const updateTarrifData = async (data,resetAll) => {
        dispatch(setTarrifLoading(true));
        const resData = await ApiManager.patch(`admin/addMaster/tarrifMaster/${data._id}`,data);

        if(!resData.error)
        {
            resetAll();
            const temp = structuredClone(tarrifData);
            temp[data?.id] = resData.data.data;
            dispatch(setTarrifData(temp));
            toast.success(resData.message);
            dispatch(setTarrifLoading(false));
            return true;
        }
        dispatch(setTarrifLoading(false));
        return false;
    }

    useEffect(() => {
        !tarrifData && getTarrifData(true);
    },[])

    return {
        listLoading,
        updateTarrifData,
        createTarrifData,
        getTarrifData
    }
}