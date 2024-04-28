import { setAppointmentCount, setAppointmentData, setAppointmentListLoading, setAppointmentLoading } from "../../slices/appointment.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setSecretoryAppointmentCount, setSecretoryAppointmentData, setSecretoryAppointmentListLoading } from "../../slices/secretoryAppointment.slice";

const ApiManager = new APIManager();

export const useAppointmentData = () => {

        const { appointmentPagination,appointmentData,startDate:sD,endDate:eD,doctorAppointmentList:D,appointmentListLoading,branch:appointmentBranch } = useSelector(state => state.appointment);

        const { appointmentPagination:secretoryAppointmentPagination,appointmentData:secretoryAppointmentData,startDate:secretorySD,endDate:secretoryED,doctorAppointmentList:secretoryD,appointmentListLoading:secretoryAppointmentListLoading,branch:secretoryAppointmentBranch } = useSelector(state => state.secretoryAppointment);

        const dispatch = useDispatch();

    const getAppintmentData = async (
        withLoading=false,
        page=appointmentPagination.page,
        pageSize=appointmentPagination.pageSize,
        startDate=sD,
        endDate=eD,
        doctor=D,
        val,
        branch=appointmentBranch) => {
        withLoading && dispatch(setAppointmentListLoading(true));
        
        let url = `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&doctor=${doctor?._id}&branch=${branch._id}`

        
        if(val){
           url = url.concat(`&searchValue=${val}`)
        }

        const data = await ApiManager.get(url);

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

    const getSecretoryAppintmentData = async (
        withLoading=false,
        page=secretoryAppointmentPagination.page,
        pageSize=secretoryAppointmentPagination.pageSize,
        startDate=secretorySD,
        endDate=secretoryED,
        doctor=secretoryD,
        val,
        branch=secretoryAppointmentBranch) => {
        withLoading && dispatch(setSecretoryAppointmentListLoading(true));
        
        let url = `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}&branch=${branch._id}`

        if(doctor){
            url = url.concat(`&doctor=${doctor?._id}`);
        }
        
        if(val){
           url = url.concat(`&searchValue=${val}`)
        }

        const data = await ApiManager.get(url);

        if(!data.error) 
        {
            dispatch(setSecretoryAppointmentData(data?.data?.data));
            dispatch(setSecretoryAppointmentCount(data?.data?.count));
            withLoading && dispatch(setSecretoryAppointmentListLoading(false));
        return true;
        }

        withLoading && dispatch(setSecretoryAppointmentListLoading(false));
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
        getSecretoryAppintmentData,
        updateAppointmentData,
        createAppointmentData,
        cancelAppointment,
        rescheduleAppointment
    }
}
