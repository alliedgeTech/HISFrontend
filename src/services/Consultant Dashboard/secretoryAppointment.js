import { setSecretoryAppointmentCount, setSecretoryAppointmentData, setSecretoryAppointmentListLoading, setSecretoryAppointmentLoading } from "../../slices/secretoryappointment.slice";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ApiManager = new APIManager();

export const useSecretoryAppointmentData = () => {
const dispatch = useDispatch();
const {
    secretoryAppointmentPagination,
    secretoryAppointmentData,
    secretoryStartDate:sD,
    secretoryEndDate:eD,
    doctorSecretoryAppointmentList:D,
    secretoryAppointmentListLoading,
  } = useSelector((state) => state.secretoryAppointment);

  const getAppointmentData = async (withLoading=false,page=secretoryAppointmentPagination.page,pageSize=secretoryAppointmentPagination.pageSize,searchBy='date',startDate=sD,endDate=eD,doctor=D,val) => {
    withLoading && dispatch(setSecretoryAppointmentLoading(true));

    let url = searchBy==='date' ? `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&searchBy=${searchBy}&startDate=${startDate}&endDate=${endDate}&doctor=${doctor?._id}` : `admin/consultant/appointment?page=${page}&pageSize=${pageSize}&searchBy=${searchBy}&startDate=${startDate}&endDate=${endDate}&doctor=${doctor?._id}&val=${val}`

    const data = await ApiManager.get(url);
        console.log("this is data majboot secretory hook :",data);
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
        dispatch(setSecretoryAppointmentLoading(true));
    
        const resData = await ApiManager.patch('admin/consultant/appointment',data);
    
        if(!resData.error)
        {
            const tempData = structuredClone(secretoryAppointmentData);
            tempData[data.id] = resData?.data?.data;
            dispatch(setSecretoryAppointmentData(tempData));
            toast.success("Appointment updated Successfully");
            dispatch(setSecretoryAppointmentLoading(false));
            return true;
        } 
        dispatch(setSecretoryAppointmentLoading(false));
        return false;
    }

    const createAppointmentData = async (data) => {
        dispatch(setSecretoryAppointmentLoading(true));

        const resData = await ApiManager.post("admin/consultant/appointment",data);

        if(!resData.error)
        {
            dispatch(setSecretoryAppointmentLoading(false));
            toast.success("Appointment Created Successfully");
            return true;
        }

        dispatch(setSecretoryAppointmentLoading(false));
        return false;
    }

    const cancelAppointment = async (data) => {
        if(!data) return toast.error("Please provide a appointment _id");
        dispatch(setSecretoryAppointmentLoading(true));

        const resData = await ApiManager.patch(`admin/consultant/appointment/cancel`,{appointmentId:data});

        if(!resData.error)
        {
            toast.success("Appointment Cancelled Successfully");
            dispatch(setSecretoryAppointmentLoading(false));
            return true;
        } 
        dispatch(setSecretoryAppointmentLoading(false));
        return false;
    
    }

    const rescheduleAppointment = async (data) => {
        dispatch(setSecretoryAppointmentLoading(true));

        const resData = await ApiManager.patch(`admin/consultant/appointment/reschedule`,data);
        if(!resData.error)
        {
            toast.success("Appointment Rescheduled Successfully");
            dispatch(setSecretoryAppointmentLoading(false));
            return true;
        } 
        dispatch(setSecretoryAppointmentLoading(false));
        return false;

    }

    return {
        secretoryAppointmentListLoading,
        getAppointmentData,
        updateAppointmentData,
        createAppointmentData,
        cancelAppointment,
        rescheduleAppointment
    }

    
};


