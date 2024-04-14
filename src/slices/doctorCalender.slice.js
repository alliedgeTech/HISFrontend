import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    location:null,
    doctor:null,
    remainingDays:null,
    sevenDayData:null,
    step:1,
    loading:false,
    doctorCalenderEditData:null,
    doctorCalenderLoading:false,
    slotDeallocationLoading:false,
    activeDaySlots:null,    
    activeDaySlotIndex:null,
    leaveRoomDate:null,
};

const doctorCalenderSlice = createSlice({
    name:'doctorCalender',
    initialState,
    reducers:{
        setDoctorCalenderLoading:(state,action) => {
            state.loading = action.payload
        },
        setDoctorCalenderEditData:(state,action) => {
            state.doctorCalenderEditData = action.payload;
        },
        setLocation:(state,action) => {
            state.location = action.payload
        },
        setDoctor:(state,action) => {
            state.doctor = action.payload
        },
        setRemainingDays:(state,action) => {
            state.remainingDays = action.payload
        },
        setSeveDayData:(state,action) => {
            state.sevenDayData = action.payload
        },
        setStep:(state,action) => {
            state.step = action.payload
        },
        setSlotDeallocationLoading:(state,action) => {
            state.slotDeallocationLoading = action.payload
        },
        setActiveDaySlots:(state,action) => {
            state.activeDaySlots = action.payload;
        },
        setActiveDaySlotsUpdate:(state,action) => {
            // TODO here we have to add 
            if(!Array.isArray(state.activeDaySlots))  return;
            const { uid,data } = action.payload;
            const slots = state.activeDaySlots;
            if(Array.isArray(slots)){
                slots = slots.map((obj)=>{
                    if(obj?.allSlots?.uid == uid && Array.isArray(obj.allSlots?.slots)){
                        obj.allSlots.slots.map((item)=>{
                            if(data._id === item._id){
                                item = data;
                            }
                            return item;
                        })
                        return obj;
                    } else {
                        return obj;
                    }
                })
            }
        },
        setAddedNewSlots:(state,action)=>{
            let slots = state.activeDaySlots;
            const { uid,at,data } = action.payload;

            if(Array.isArray(slots)){
                slots = slots.map((obj) => {
                    if(obj?.allSlots?.uid == uid) {
                        if(Array.isArray(obj?.allSlots?.slots)){
                            if(Number.isInteger(at)){
                                obj.allSlots.slots.splice(at,0,data);
                            } else {
                                obj.allSlots.slots = [...obj.allSlots.slots,...data];
                            }
                        } else {
                            obj.allSlots.slots = data;
                        }
                        return obj;
                    } else  {
                        return obj;
                    }
                })
            }
        },
        setRemoveSlots:(state,action) => {
            const { uid,data } = action.payload;

            if(Array.isArray(state.activeDaySlots)){
                state.activeDaySlots = state.activeDaySlots.map((obj) => {
                    if(obj?.allSlots?.uid == uid && Array.isArray(obj?.allSlots?.slots)) {
                        obj.allSlots.slots = obj.allSlots.slots.filter((slot) => !data.includes(slot._id))
                    } else {
                        return obj;
                    }
                })

            //    state.activeDaySlots = state.activeDaySlots.filter((obj) => obj?.allSlots?.slots?.length > 0);
            }
        },
        setActiveDaySlotIndex: (state,action) => {
            state.activeDaySlotIndex = action.payload
        },
        setLeveRoomDate: (state,action) => {
            state.leaveRoomDate = action.payload
        }
    }
})

export const { setLocation,setDoctor,setRemainingDays,setSeveDayData,setStep,setDoctorCalenderLoading,setDoctorCalenderEditData,setSlotDeallocationLoading,setActiveDaySlots,setActiveDaySlotIndex,setLeveRoomDate,setActiveDaySlotsUpdate,setAddedNewSlots,setRemoveSlots } = doctorCalenderSlice.actions;

export default doctorCalenderSlice.reducer;