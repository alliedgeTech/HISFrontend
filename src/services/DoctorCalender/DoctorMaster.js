import { useDispatch,useSelector } from 'react-redux';
import APIManager from '../../utils/ApiManager';
import toast from "react-hot-toast";
import { setDoctorCalenderLoading, setSeveDayData, setSlotDeallocationLoading } from '../../slices/doctorCalender.slice';

const ApiManager = new APIManager();
export const useDoctorMasterData = () => {

    const dispatch = useDispatch();
    const {doctorCalenderEditData,sevenDayData } = useSelector(state => state.doctorCalender);
    const createDoctorSlotData = async(data) => {
        const toastId = toast.loading("Loading...");
        dispatch(setDoctorCalenderLoading(true))
        const resData = await ApiManager.post('admin/calender/doctor',data);
        if(!resData.error)
        {
            dispatch(setDoctorCalenderLoading(false))
            toast.dismiss(toastId)
            return true;
       }  
       dispatch(setDoctorCalenderLoading(false));
       toast.dismiss(toastId);
       return false;
    }

    const updateDoctorSlotData = async (data) => {
        const toastId = toast.loading("Loading...")
        const resData = await ApiManager.patch('admin/calender/doctor',data);
        if(!resData.error)
        {
            const temp = structuredClone(sevenDayData);
            temp.commonSchedule[doctorCalenderEditData].doctorTime = resData?.data?.data;
            dispatch(setSeveDayData(temp));
            dispatch(setDoctorCalenderLoading(false));
            toast.dismiss(toastId);
            toast.success("Solts Updated Successfully")
            return true;
        }
        dispatch(setDoctorCalenderLoading(false))
        toast.dismiss(toastId);
        return false;
    }

    const BreakDoctorSlotData = async (data) => {
        console.log("this is break data ",data);
        const resData = await ApiManager.patch("admin/calender/doctor/break",data);
        if(!resData.error) {
            toast.success("your break successfull");
        }

    }


    return {
        createDoctorSlotData,
        updateDoctorSlotData,
        BreakDoctorSlotData
    }
}