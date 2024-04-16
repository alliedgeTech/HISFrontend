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
            if(!Array.isArray(state.activeDaySlots))  return;
            const { uid,data } = action.payload;
            let slots = state.activeDaySlots;
            if(Array.isArray(slots)){
                slots = slots.map((obj)=>{
                    if(obj?.allSlots?.uid == uid && Array.isArray(obj.allSlots?.slots)){
                        obj.allSlots.slots = obj.allSlots.slots.map((item)=>{
                            const findSlotInData = data.find((updatedData)=> updatedData._id == item._id );

                            console.log('this is got slots for update : ',findSlotInData);

                            if(findSlotInData){
                                item = {...item,...findSlotInData};
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

            console.log("this data we have to add : ",data);

            if(Array.isArray(slots)){
                slots = slots.map((obj) => {
                    if(obj?.allSlots?.uid == uid) {
                        if(Array.isArray(obj?.allSlots?.slots)){
                            if(Number.isInteger(at)){
                                obj.allSlots.slots.splice(at,0,...data);
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
            let slots = state.activeDaySlots;
            if(Array.isArray(slots)){
                slots = slots.map((obj) => {

                    console.log("is this allSlots  : ",obj);
                    if(obj?.allSlots?.uid == uid && Array.isArray(obj?.allSlots?.slots)) {
                        console.log("is this is mapping and uid also match : ",obj.allSlots,obj.allSlots.slots);

                        obj.allSlots.slots = obj.allSlots.slots.filter((slot) => !data.includes(slot._id))
                    } else {
                        return obj;
                    }
                })

                console.log("this is done the process");

            //    state.activeDaySlots = state.activeDaySlots.filter((obj) => obj?.allSlots?.slots?.length > 0);
            }
        },
        setActiveDaySlotIndex: (state,action) => {
            console.log('hello ji i am setted the index : ',action.payload);
            state.activeDaySlotIndex = action.payload
        },
        setLeveRoomDate: (state,action) => {
            state.leaveRoomDate = action.payload
        }
    }
})

export const { setLocation,setDoctor,setRemainingDays,setSeveDayData,setStep,setDoctorCalenderLoading,setDoctorCalenderEditData,setSlotDeallocationLoading,setActiveDaySlots,setActiveDaySlotIndex,setLeveRoomDate,setActiveDaySlotsUpdate,setAddedNewSlots,setRemoveSlots } = doctorCalenderSlice.actions;

export default doctorCalenderSlice.reducer;