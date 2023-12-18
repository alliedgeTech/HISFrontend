import { createSlice } from "@reduxjs/toolkit"
import branchSlice from "./branch.slice"

const initialState = {
    appointmentData: null,
    appointmentLoading: false,
    appointmentEditData: null,
    appointmentCount:null,
    appointmentPagination:{page:0,pageSize:10},
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
        }
    }
}) 

export const { setAppointmentCount,setAppointmentData,setAppointmentEditData,setAppointmentLoading,setAppointmentpagination } = appointmentSlice.actions;

export default appointmentSlice.reducer;