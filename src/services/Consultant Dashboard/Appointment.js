import { useEffect, useState } from "react";
import { setAppointmentCount, setAppointmentData, setAppointmentListLoading, setAppointmentLoading } from "../../slices/appointment.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ApiManager = new APIManager();

export const useAppointmentData = () => {

        const { appointmentPagination,appointmentData,startDate:sD,endDate:eD,doctorAppointmentList:D,appointmentListLoading } = useSelector(state => state.appointment);
        const dispatch = useDispatch();

    const getAppintmentData = async (withLoading=false,page=appointmentPagination.page,pageSize=appointmentPagination.pageSize,searchBy='date',startDate=sD,endDate=eD,doctor=D,val) => {
        // console.log("this is with loading : ",withLoading)
        withLoading && dispatch(setAppointmentListLoading(true));
        
        let url = searchBy==='date' ? `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&searchBy=${searchBy}&startDate=${startDate}&endDate=${endDate}&doctor=${doctor?._id}` : `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&searchBy=${searchBy}&startDate=${startDate}&endDate=${endDate}&doctor=${doctor?._id}&val=${val}`

        const data = await ApiManager.get(url);
        console.log("this is data majboot hook :",data);
        if(!data.error) 
        {
            dispatch(setAppointmentData(data?.data?.data));
            dispatch(setAppointmentCount(data?.data?.count));
            withLoading && dispatch(setAppointmentListLoading(false));
        return true;
        }

        withLoading && dispatch(setAppointmentListLoading(false));
        return false;
    }


    const updateAppointmentData = async (data) => {
        dispatch(setAppointmentLoading(true));

        const resData = await ApiManager.patch('admin/consultant/appointment',data);

        if(!resData.error)
        {
            const tempData = structuredClone(appointmentData);
            tempData[data.id] = resData?.data?.data;
            dispatch(setAppointmentData(tempData));
            toast.success("Appointment updated Successfully");
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
            dispatch(setAppointmentLoading(false));
            toast.success("Appointment Created Successfully");
            return true;
        }

        dispatch(setAppointmentLoading(false));
        return false;
    }

    const cancelAppointment = async (data) => {
        if(!data) return toast.error("Please provide a appointment _id");
        dispatch(setAppointmentLoading(true));

        const resData = await ApiManager.patch(`admin/consultant/appointment/cancel`,{appointmentId:data});

        if(!resData.error)
        {
            toast.success("Appointment Cancelled Successfully");
            dispatch(setAppointmentLoading(false));
            return true;
        } 
        dispatch(setAppointmentLoading(false));
        return false;
    
    }

    const rescheduleAppointment = async (data) => {
        dispatch(setAppointmentLoading(true));

        const resData = await ApiManager.patch(`admin/consultant/appointment/reschedule`,data);
        if(!resData.error)
        {
            toast.success("Appointment Rescheduled Successfully");
            dispatch(setAppointmentLoading(false));
            return true;
        } 
        dispatch(setAppointmentLoading(false));
        return false;

    }

    return {
        appointmentListLoading,
        getAppintmentData,
        updateAppointmentData,
        createAppointmentData,
        cancelAppointment,
        rescheduleAppointment
    }
}
