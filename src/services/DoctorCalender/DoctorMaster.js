import { useDispatch,useSelector } from 'react-redux';
import APIManager from '../../utils/ApiManager';
import toast from "react-hot-toast";
import { setActiveDaySlotIndex, setDoctorCalenderLoading, setRemainingDays, setSeveDayData, setSlotDeallocationLoading } from '../../slices/doctorCalender.slice';
import { useEffect } from 'react';

const ApiManager = new APIManager();
export const useDoctorMasterData = () => {

    const dispatch = useDispatch();
    const { doctor,activeDaySlotIndex,sevenDayData } = useSelector(state => state.doctorCalender);

    const createDoctorSlotData = async(data) => {
        const toastId = toast.loading("Loading...");
        dispatch(setDoctorCalenderLoading(true))
        const resData = await ApiManager.post('admin/calender/commonschedule',data);
        if(!resData.error)
        {
            dispatch(setDoctorCalenderLoading(false))
            getDoctorCalenderData();
            toast.dismiss(toastId)
            return true;
       }  
       dispatch(setDoctorCalenderLoading(false));
       toast.dismiss(toastId);
       return false;
    }

    const updateDoctorSlotData = async (data) => {
        const toastId = toast.loading("Loading...")
        const resData = await ApiManager.patch(`admin/calender/commonschedule/${data._id}`,data);
        if(!resData.error)
        {
            getDoctorCalenderData();
            dispatch(setDoctorCalenderLoading(false));
            toast.dismiss(toastId);
            toast.success("Solts Updated Successfully")
            return true;
        }
        dispatch(setDoctorCalenderLoading(false))
        toast.dismiss(toastId);
        return false;
    }

    function getIndexFromTheDayName(day) {
        switch(day) {
            case "Sunday":
                return 0;
                break;
            case "Monday":
                return 1;
                break;
            case "Tuesday":
                return 2;
                break;
            case "Wednesday":
                return 3;
                break;
            case "Thursday":
                return 4;
                break;
            case "Friday":
                return 5;
                break;
            case "Saturday":
                return 6;
                break;
            default:
                return -1;

        }
    }

    function getCurrentWeekDateByDay(dayName) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        const currentDayIndex = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        let daysToAdd = targetDayIndex - currentDayIndex;
    
        if (daysToAdd < 0) {
          // If the target day is earlier in the week, add 7 days to get the next occurrence.
          daysToAdd += 7;
        }
    
        if (daysToAdd === 0) {
          // If the target day is today, return today's date.
          return new Date(today).toLocaleDateString("en-CA",{ timeZone:'Asia/Kolkata' });
        }
    
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysToAdd);
    
        return new Date(nextDate).toLocaleDateString("en-CA",{ timeZone:'Asia/Kolkata' });
    }

    const formatSevenDaysData = ({schedule}) => {

        const tempData = [{label:"Monday",value:"Monday"},{ label: "Tuesday",value:"Tuesday"},{ label: "Wednesday",value: "Wednesday"},{ label: "Thursday",value:"Thursday"},{label:"Friday",value:'Friday'},{label:"Saturday",value:'Saturday'},{label:"Sunday",value:"Sunday"}];

        if(Number.isInteger(schedule?.length) && schedule?.length === 0){
            dispatch(setRemainingDays(tempData))
        } else {
            let filterdTempData = [{label:"Monday",value:"Monday"},{ label: "Tuesday",value:"Tuesday"},{ label: "Wednesday",value: "Wednesday"},{ label: "Thursday",value:"Thursday"},{label:"Friday",value:'Friday'},{label:"Saturday",value:'Saturday'},{label:"Sunday",value:"Sunday"}];
            filterdTempData = tempData.filter((item)=> !schedule.some((element)=> item.value === element.day ));

            let firstIndexShouldRemove = 0 ;
            const pivotDayIndex = new Date().getDay();

            schedule = schedule.map((item)=>{
                const index = getIndexFromTheDayName(item.day);
               return {
                    ...item,
                    index,
                    date: getCurrentWeekDateByDay(item.day)
                }
            })  
            
            schedule.sort((a,b)=> a.index - b.index);

            schedule.forEach(element => {
                if(element.index < pivotDayIndex ){
                    firstIndexShouldRemove ++;
                } else {
                    console.log("this is run why index is seted : ", element.index === pivotDayIndex && activeDaySlotIndex === null);
                    element.index === pivotDayIndex && activeDaySlotIndex === null && dispatch(setActiveDaySlotIndex(0));
                    return;
                }
            });

            console.log("this is first index should remove : ",firstIndexShouldRemove)

            const spliceData = schedule.splice(0,firstIndexShouldRemove);

            schedule = [...schedule,...spliceData];
            console.log("this is processed data : ",schedule);
            dispatch(setSeveDayData(schedule));
            dispatch(setRemainingDays(filterdTempData));

        }
    }

    const getDoctorCalenderData = async () => {
        
        dispatch(setDoctorCalenderLoading(true));
        const resData = await ApiManager.get(`admin/calender/commonschedule/${doctor._id}`);
        if(!resData.error)
        {
            let schedule = resData.data.data;
            formatSevenDaysData({schedule});
        }

        dispatch(setDoctorCalenderLoading(false));

    }

    const BreakDoctorSlotData = async (data) => {
        console.log("this is break data ",data);
        const resData = await ApiManager.patch("admin/calender/doctor/break",data);
        if(!resData.error) {
            toast.success("your break successfull");
        }
    }

    const multiBreakOfSlots = async(data) => {
        const toastId = toast.loading("Loading...");    
        const resData = await ApiManager.post("admin/calender/slots/multibreak",data);
        if(!resData.error){
            toast.dismiss(toastId);
            toast.success("slots are breaked successfully");
            return true;
        }    
        toast.dismiss(toastId);
        return false;
    }
    useEffect(()=>{
        !sevenDayData && getDoctorCalenderData();
    },[doctor]);


    return {
        createDoctorSlotData,
        updateDoctorSlotData,
        BreakDoctorSlotData,
        getDoctorCalenderData,
        formatSevenDaysData,
        multiBreakOfSlots
    }
}