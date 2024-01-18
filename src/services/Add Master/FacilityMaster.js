import APIManager from "../../utils/ApiManager"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast'
import { setFacilityCount, setFacilityCountIncByOne, setFacilityData, setFacilityLoading } from "../../slices/facility.slice";

const ApiManager = new APIManager();

export const useFacilityData = () => {

    const dispatch = useDispatch();
    const {facilityData,facilityPagination:paginationModel} = useSelector(state => state.facility);
    const [ListLoading, setListLoading] = useState(false);

    const getFacilityData = async (withLoading=false,page=paginationModel?.page,pageSize=paginationModel?.pageSize) => {
            withLoading && setListLoading(true);

            const resData = await ApiManager.get(`admin/facilityMaster?page=${page}&pageSize=${pageSize}`);

            if(!resData.error) {
                dispatch(setFacilityData(resData.data.data));
                dispatch(setFacilityCount(resData.data.count));
                withLoading && setListLoading(false);
                return true;
            }

            withLoading && setListLoading(false);
            return false;
    }

    const createFacilityData = async (data,resetAll) => {
        dispatch(setFacilityLoading(true));
        const resData = await ApiManager.post(`admin/facilityMaster`,data);
        if(!resData.error) {
            resetAll();
            const { page, pageSize } = paginationModel;
            if(Number.isNaN(facilityData?.length) || page*pageSize+pageSize > facilityData?.length) {
                getFacilityData();
            } else { 
                dispatch(setFacilityCountIncByOne());
            }
            dispatch(setFacilityLoading(false));
            toast.success(resData.message);
            return true;
        } 

        dispatch(setFacilityLoading(false));
        return false;
    }

    const updateFacilityData = async (data,resetAll) => {
        dispatch(setFacilityLoading(true)); 

        const resData = await ApiManager.put(`admin/facilityMaster/${data._id}`,data);

        if(!resData.error) {
            resetAll();
            const temp = structuredClone(facilityData);
            temp[data?.id] = resData.data.data;
            dispatch(setFacilityData(temp));
            toast.success(resData.message);
            dispatch(setFacilityLoading(false));
            return true;
        }

        dispatch(setFacilityLoading(false));
        return false;
    }

    useEffect(()=>{
        !facilityData && getFacilityData(true);
    },[])

    return {
        ListLoading,
        getFacilityData,
        createFacilityData,
        updateFacilityData
    }
}