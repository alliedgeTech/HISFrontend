import { createSlice } from "@reduxjs/toolkit"
import branchSlice from "./branch.slice"

const initialState = {
    appointmentData: null,
    appointmentLoading: false,
    appointmentEditData: null,
    appointmentCount:null,
    appointmentPagination:{page:0,pageSize:10},
    startDate:new Date().toLocaleDateString('en-CA').toString(),
    endDate:new Date().toLocaleDateString('en-CA').toString(),
    doctorAppointmentList:null,
    appointmentStep:2,
    appointmentJwtData:null,
    appointmentOutTimeData:null,
}

const appointmentSlice = createSlice({
    name:"appointment",
    initialState,
    reducers:{
        setAppointmentData : (state,action) => {
            state.appointmentData = action.payload
        },
        setAppointmentLoading : (state,action) => {
            state.appointmentLoading = action.payload
        },
        setAppointmentEditData : (state,action) => {
            state.appointmentEditData = action.payload
        },
        setAppointmentCount : (state,action) => {
            state.appointmentCount = action.payload
        },
        setAppointmentpagination : (state,action) => {
            state.appointmentPagination.page = action.payload.page;
            state.appointmentPagination.pageSize = action.payload.pageSize;
        },
        setStartDate: (state,action) => {
            state.startDate = action.payload
        },
        setEndDate : (state,action) => {
            state.endDate = action.payload
        },
        setShowDoctorAppointment : (state,action) => {
            state.doctorAppointmentList = action.payload;
        },
        setAppointmentStep : (state,action) => {
            state.appointmentStep = action.payload;
        },
        setAppointmentJwtData : (state,action) => {
            state.appointmentJwtData = action.payload;
        },
        setAppointmentOutTimeData : (state,action) => {
            state.appointmentOutTimeData = action.payload;
        }
    }
}) 

export const { setAppointmentCount,setAppointmentData,setAppointmentEditData,setAppointmentLoading,setAppointmentpagination,setStartDate,setEndDate,setShowDoctorAppointment,setAppointmentJwtData,setAppointmentOutTimeData,setAppointmentStep } = appointmentSlice.actions;

export default appointmentSlice.reducer;