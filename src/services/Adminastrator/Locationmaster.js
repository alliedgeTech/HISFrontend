import { useDispatch, useSelector } from "react-redux";
import APIManager from "../../utils/ApiManager"
import { setBranchCount, setBranchCountByOne, setBranchData, setBranchLoading } from "../../slices/branch.slice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useState } from "react";

const ApiManager = new APIManager();

export const useBranchData = () => {
    const dispatch = useDispatch();
    const {branchLoading:Loading,branchData,branchCount,branchPagination:paginationModel} = useSelector(state => state.branch);
    const [ListLoading, setListLoading] = useState(false);
    const getBranchData = async (withLoading=false,page=paginationModel.page,pageSize=paginationModel.pagesize) => {
        if(withLoading)
        {
            setListLoading(true);
        }
        const resData = await ApiManager.get(`admin/locationMaster/getlocation?page=${page}&pageSize=${pageSize}`);

        if(!resData.error){
            dispatch(setBranchData(resData.data.data)); 
            dispatch(setBranchCount(resData.data.count));
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
    if(!branchData)
        getBranchData(true,0,10);
    },[]);

    const updateBranchData =async (data,page,pageSize) => {

        const toastId = toast.loading("Loading...");
        dispatch(setBranchLoading(true));
        const resData = await ApiManager.patch(`admin/locationMaster/updatelocation/${data._id}`,data);

        if(!resData.error)
        {
            getBranchData(false,page,pageSize);
            toast.dismiss(toastId)
            toast.success(resData.message);
            dispatch(setBranchLoading(false));
            return true;    
        }

        toast.dismiss(toastId);
        toast.error(resData.message);
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
                dispatch(setBranchCountByOne());
            }
            toast.dismiss(toastId)
            toast.success(resData.message);
            dispatch(setBranchLoading(false));
            return true;
        }

        toast.dismiss(toastId);
        toast.error(resData.message);
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