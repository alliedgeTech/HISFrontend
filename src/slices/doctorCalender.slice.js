import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    city:null,
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
    activeDaySlotIndex:0,
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
        setCity:(state,action) => {
            state.city = action.payload 
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
        setActiveDaySlotIndex: (state,action) => {
            state.activeDaySlotIndex = action.payload
        },
        setLeveRoomDate: (state,action) => {
            state.leaveRoomDate = action.payload
        }
    }
})

export const { setCity,setLocation,setDoctor,setRemainingDays,setSeveDayData,setStep,setDoctorCalenderLoading,setDoctorCalenderEditData,setSlotDeallocationLoading,setActiveDaySlots,setActiveDaySlotIndex,setLeveRoomDate } = doctorCalenderSlice.actions;

export default doctorCalenderSlice.reducer;