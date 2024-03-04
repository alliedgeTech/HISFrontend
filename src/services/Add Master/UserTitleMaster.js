import { setUserTitleCount, setUserTitleCountIncByOne, setUserTitleData, setUserTitleListLoading, setUserTitleLoading } from "../../slices/userTitle.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast'
import { useEffect, useState } from "react";
import { setRegistrationEmptyData } from "../../slices/registration.slice";

const ApiManager = new APIManager();

export const useUserTitleMasterData = () => {

    const  { userTitleData,userTitlePaginaiton:paginationModal } =  useSelector(state => state.userTitle);
    const dispatch = useDispatch();

    const getUserTitleData = async (withLoading=false,page=paginationModal.page,pageSize=paginationModal.pageSize) => {
            
            if(withLoading)
            {
                dispatch(setUserTitleListLoading(true));
            }
    
            const resData = await ApiManager.get(`admin/addMaster/title?page=${page}&pageSize=${pageSize}`);
    
            if(!resData.error){
                dispatch(setUserTitleData(resData.data.data)); 
                dispatch(setUserTitleCount(resData.data.count));
                withLoading && dispatch(setUserTitleListLoading(false));
                return true; 
            }
    
            if(withLoading)
            {
                dispatch(setUserTitleListLoading(false));
            }
    
            return false;
    }

    const createUserTitleData = async (data,resetAll) => {

            const toastId = toast.loading("Loading...");
            dispatch(setUserTitleLoading(true));
            const resData = await ApiManager.post(`admin/addMaster/title`,data);

            if(!resData.error){
                const { page,pageSize } = paginationModal;

                if(Number.isNaN(userTitleData?.length) || page*pageSize+pageSize > userTitleData?.length) {
                    getUserTitleData();
                } else {
                    dispatch(setUserTitleCountIncByOne());
                }
                resetAll();
                toast.dismiss(toastId);
                dispatch(setUserTitleLoading(false));
                return true;
            }

            dispatch(setUserTitleLoading(false));
            toast.dismiss(toastId);
            return false;
    }

    const updateUserTitleData = async (data,resetAll) => {

        dispatch(setUserTitleLoading(true));
        const resData = await ApiManager.patch(`admin/addMaster/title`,data);
        
        if(!resData.error)
        {
            resetAll();
            const temp = structuredClone(userTitleData); 
            temp[data?.id] = resData.data.data;
            dispatch(setUserTitleData(temp));
            dispatch(setRegistrationEmptyData());
            toast.success(resData.message);
            dispatch(setUserTitleLoading(false));
            return true;
        }

        dispatch(setUserTitleLoading(false));
        return false;
    }

    useEffect(() => {
        !userTitleData && getUserTitleData(true);
    },[])

    return {
        updateUserTitleData,
        createUserTitleData,
        getUserTitleData
    }
}