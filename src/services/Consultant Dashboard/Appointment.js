import { useEffect, useState } from "react";
import { setAppointmentCount, setAppointmentData, setAppointmentLoading } from "../../slices/appointment.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";

const ApiManager = new APIManager();

export const useAppointmentData = () => {

        const [ListLoading, setListLoading] = useState(false);
        const { appointmentPagination,appointmentData } = useSelector(state => state.appointment);
        const dispatch = useDispatch();

    const getAppintmentData = async (withLoading=false,page=appointmentPagination.page,pageSize=appointmentPagination.pageSize) => {
        withLoading && setListLoading(true);
        
        const data = await ApiManager.get(`admin/consultant/appointment?page=${page}&pageSize=${pageSize}`);

        if(!data.error)
        {
            dispatch(setAppointmentData(data?.data?.data));
            dispatch(setAppointmentCount(data?.data?.count));
            withLoading && setListLoading(false);
            return true;
        }

        withLoading && setListLoading(false);
        return false;
    }


    const updateAppointmentData = async (data) => {
        dispatch(setAppointmentLoading(true));

        const resData = await ApiManager.patch('admin/consultant/appointment');

        if(!resData.error)
        {
            const tempData = structuredClone(appointmentData);
            tempData[data.id] = resData?.data?.data;
            dispatch(setAppointmentData(tempData));
            dispatch(setAppointmentLoading(false));
            return true;
        } 
        dispatch(setAppointmentLoading(false));
        return false;
    }

    const createAppointmentData = async (data) => {

        dispatch(setAppointmentLoading(true));

        const resData = await ApiManager.post("admin/consultant/appointment",data);

        if(!resData.error)
        {
            getAppintmentData();
            dispatch(setAppointmentLoading(false));
            return true;
        }

        dispatch(setAppointmentLoading(false));
        return false;
    }


    useEffect(() => {
        !appointmentData && getAppintmentData(true);
    },[])


    return {
        ListLoading,
        getAppintmentData,
        updateAppointmentData,
        createAppointmentData
    }
}
