import { useDispatch, useSelector } from "react-redux";
import APIManager from "../../utils/ApiManager"
import { setBranchCount, setBranchCountIncByOne, setBranchData, setBranchListLoading, setBranchLoading } from "../../slices/branch.slice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import { setSeveDayData } from "../../slices/doctorCalender.slice";

const ApiManager = new APIManager();

export const useBranchData = () => {
    const dispatch = useDispatch();
    const {branchLoading:Loading,branchData,branchCount,branchPagination:paginationModel,branchListLoading:ListLoading} = useSelector(state => state.branch);
    const getBranchData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pagesize) => {
        if(withLoading)
        {
            dispatch(setBranchListLoading(true));
        }
        const resData = await ApiManager.get(`admin/locationMaster/getlocation?page=${page}&pageSize=${pageSize}`);

        if(!resData.error){
            dispatch(setBranchData(resData.data.data)); 
            dispatch(setBranchCount(resData.data.count));
            withLoading && dispatch(setBranchListLoading(false));
            return true; 
        }
        if(withLoading)
        {
            dispatch(setBranchListLoading(false));
        }
        return false;
    }

    useEffect(() => {
    if(!branchData)
        getBranchData(true,0,10);
    },[]);

    const updateBranchData =async (data,page,pageSize) => {

        const toastId = toast.loading("Loading...");
        dispatch(setBranchLoading(true));
        const resData = await ApiManager.patch(`admin/locationMaster/updatelocation/${data._id}`,data);

        if(!resData.error)
        {
            let tempdata = structuredClone(branchData);
            tempdata[data?.id] = resData.data.data;
            dispatch(setSeveDayData(null));
            dispatch(setBranchData(tempdata));
            dispatch(setBranchLoading(false));
            toast.dismiss(toastId)
            toast.success(resData.message);
            return true;    
        }

        toast.dismiss(toastId);
        dispatch(setBranchLoading(false));
        return false;
    }

    const addBranchData = async (data,page,pageSize) => {
        dispatch(setBranchLoading(true));
        const toastId = toast.loading("Loading...");
        const resData = await ApiManager.post("admin/locationMaster/addlocation",data);
        if(!resData.error)
        {
            if( Number.isNaN(branchData?.length) || page*pageSize+pageSize > branchData?.length) {
                getBranchData(false,page,pageSize);
            } else { 
                dispatch(setBranchCountIncByOne());
            }
            dispatch(setBranchLoading(false));
            toast.dismiss(toastId)
            toast.success(resData.message);
            return true;
        }

        toast.dismiss(toastId);
        dispatch(setBranchLoading(false));
        return false;
    }


    return {
        getBranchData,
        updateBranchData,
        addBranchData,
        Loading,
        ListLoading,
        branchCount,
        paginationModel
    }

}