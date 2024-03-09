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
    appointmentStep:0,
    appointmentJwtData:null,
    appointmentOutTimeData:null,
    appointmentListLoading:false
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
        },
        setAppointmentListLoading : (state,action) => { 
            state.appointmentListLoading = action.payload;   
        },
        setAppointmentUpdatedData:(state,action) => {
            let newData  = action.payload;
            if(Array.isArray(state.appointmentData)) {
               state.appointmentData = state.appointmentData.map((data) => (
                    data._id === newData._id ?  {...data,...newData} : data
                ))
            }
        },
        setNewDataAppointmentJwtData: (state,action) => {
            console.log("this is am updaing the new things :  ",state.appointmentData,action.payload)
            if(Array.isArray(state.appointmentJwtData)) {
                !state.appointmentJwtData.find((data) => data._id === action.payload._id) && 
                state.appointmentJwtData.push(action.payload);
            }
        },
        setUpdatedAppointmentJwtData:(state,action) => {
            if(Array.isArray(state.appointmentJwtData)) {
                state.appointmentJwtData = state.appointmentJwtData.map((data) => (
                    data._id === action.payload._id ?  {...data,...action.payload} : data
                ))
            }
        },
        setRemovedAppointmentJwtData:(state,action) => {
            if(Array.isArray(state.appointmentJwtData)) {
                state.appointmentJwtData = state.appointmentJwtData.filter((data) => data._id !== action.payload)
            }
        },
        setNewAppointmentOutTimeData:(state,action) => {
            if(action.payload && Array.isArray(state.appointmentOutTimeData)){
                !state.appointmentOutTimeData.find((obj) => obj._id === action.payload._id) &&
                state.appointmentOutTimeData.push(action.payload);
            }
        }
    }
}) 

export const { setAppointmentCount,setAppointmentData,setAppointmentEditData,setAppointmentLoading,setAppointmentpagination,setStartDate,setEndDate,setShowDoctorAppointment,setAppointmentJwtData,setAppointmentOutTimeData,setAppointmentStep,setAppointmentListLoading,setAppointmentUpdatedData,setNewDataAppointmentJwtData,setUpdatedAppointmentJwtData,setRemovedAppointmentJwtData,setNewAppointmentOutTimeData } = appointmentSlice.actions;

export default appointmentSlice.reducer;