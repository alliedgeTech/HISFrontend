import { createSlice } from "@reduxjs/toolkit";
import socket from "../socket";

const initialState = {
  appointmentData: null,
  appointmentLoading: false,
  appointmentEditData: null,
  appointmentCount: null,
  appointmentPagination: { page: 0, pageSize: 10 },
  startDate: new Date().toLocaleDateString("en-CA").toString(),
  endDate: new Date().toLocaleDateString("en-CA").toString(),
  doctorAppointmentList: null,
  branch:null,
  appointmentStep: 0,
  appointmentJwtData: null,
  appointmentOutTimeData: null,
  appointmentListLoading: false,
  appointmentCurrentSocketRooms: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setAppointmentData: (state, action) => {
      state.appointmentData = action.payload;
    },
    setAppointmentLoading: (state, action) => {
      state.appointmentLoading = action.payload;
    },
    setAppointmentEditData: (state, action) => {
      state.appointmentEditData = action.payload;
    },
    setAppointmentCount: (state, action) => {
      state.appointmentCount = action.payload;
    },
    setAppointmentpagination: (state, action) => {
      state.appointmentPagination.page = action.payload.page;
      state.appointmentPagination.pageSize = action.payload.pageSize;
    },
    setAppointmentBranch: (state,action) => {
      state.branch = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setNewAppointmentData: (state, action) => {
        if(Array.isArray(state.appointmentData)) {
             if( state.appointmentData.length < state.appointmentPagination.pageSize ){
                if(state.appointmentData.findIndex((obj) => obj._id === action.payload._id) === -1) {
                  state.appointmentCount += 1;
                  state.appointmentData.push(action.payload);                  
                }
             } else {
                state.appointmentCount = state.appointmentCount + 1;
             }  
                 
        } else {
            state.appointmentData = [action.payload];
            state.appointmentCount = 1;
        }     
    },
    setRemoveAppointmentData: (state, action) => {
      if(Array.isArray(state.appointmentData) && state.appointmentData.length > 0) {
        state.appointmentData = state.appointmentData.filter((obj) => obj._id !== action.payload.data);
      } 
      if(state.appointmentData.length === 0) {
        if(state.appointmentPagination.page >= 1) {
          let count = state.appointmentPagination.page;
          state.appointmentCount -= 1;
          typeof action.payload.getAppintmentData === 'function' && queueMicrotask(()=> action.payload.getAppintmentData(true,count-1))
        } else {
          state.appointmentData = null;
          state.appointmentCount = 0;
        }
      } else {
        state.appointmentCount -= 1;
      }
    },
    setShowDoctorAppointment: (state, action) => {
      state.doctorAppointmentList = action.payload;
    },
    setAppointmentStep: (state, action) => {
      state.appointmentStep = action.payload;
    },
    setAppointmentJwtData: (state, action) => {
      state.appointmentJwtData = action.payload;
    },
    setAppointmentOutTimeData: (state, action) => {
      state.appointmentOutTimeData = action.payload;
    },
    setAppointmentListLoading: (state, action) => {
      state.appointmentListLoading = action.payload;
    },
    setAppointmentUpdatedData: (state, action) => {
      let newData = action.payload;
      
      if (Array.isArray(state.appointmentData)) {
        state.appointmentData = state.appointmentData.map((data) => {
            const updatedAppointment = newData.find((appointmentData)=>appointmentData._id === data._id);

            if(updatedAppointment) {
              data = { ...data ,...updatedAppointment };
            }
            return data;
          }
        );
      }
    },
    setNewDataAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
        !state.appointmentJwtData.find(
          (data) => data._id === action.payload._id
        ) && state.appointmentJwtData.push(action.payload);
      } else {
        state.appointmentJwtData = [action.payload];
      }
    },
    setUpdatedAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
        state.appointmentJwtData = state.appointmentJwtData.map((data) =>
          data._id === action.payload._id
            ? { ...data, ...action.payload }
            : data
        );
      }
    },
    setRemovedAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
        state.appointmentJwtData = state.appointmentJwtData.filter(
          (data) => data._id !== action.payload
        );
        if(state.appointmentJwtData?.length === 0) {
          state.appointmentJwtData = null;
        } else {
          state.appointmentCount -= 1;
        }
      }
    },
    setNewAppointmentOutTimeData: (state, action) => {
      if (action.payload && Array.isArray(state.appointmentOutTimeData)) {
        !state.appointmentOutTimeData.find(
          (obj) => obj._id === action.payload._id
        ) && state.appointmentOutTimeData.push(action.payload);
      } else {
        state.appointmentOutTimeData = [action.payload];
      }
    },
    setAppointmentCurrentSocketRooms: (state, action) => {
        console.log("i am start to leave the room : ", state.appointmentCurrentSocketRooms)
      if (
        Array.isArray(state.appointmentCurrentSocketRooms) &&
        state.appointmentCurrentSocketRooms.length > 0
      ) {
        socket.emit("leaveRoom", state.appointmentCurrentSocketRooms);
      }
      let startDate = action.payload?.startDate;
      let endDate = action.payload?.endDate;
      let doctorId = action.payload?.doctorId;
      let branchId = action.payload?.branch;

      if(startDate && endDate && doctorId && branchId) {
        const dateArray = [];

        // Convert startDate and endDate to Date objects
        startDate = new Date(startDate);
        endDate = new Date(endDate);
  
        // Include startDate and endDate in the array
        if (startDate.getTime() === endDate.getTime()) {
          dateArray.push(doctorId + "_" + new Date(startDate).toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment"); // Push doctorId prefix + startDate as a string
        } else {
          // Loop through dates from startDate to endDate
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            dateArray.push(
              doctorId + "_" + currentDate.toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment"
            ); // Push doctorId prefix + current date as a string
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        state.appointmentCurrentSocketRooms = dateArray;
        socket.emit("joinRoom", dateArray);
      }
    },
  },
});

export const {
  setAppointmentCount,
  setAppointmentData,
  setAppointmentEditData,
  setAppointmentLoading,
  setAppointmentpagination,
  setRemoveAppointmentData,
  setAppointmentBranch,
  setStartDate,
  setEndDate,
  setShowDoctorAppointment,
  setAppointmentJwtData,
  setAppointmentOutTimeData,
  setAppointmentStep,
  setAppointmentListLoading,
  setAppointmentUpdatedData,
  setNewDataAppointmentJwtData,
  setUpdatedAppointmentJwtData,
  setRemovedAppointmentJwtData,
  setNewAppointmentOutTimeData,
  setAppointmentCurrentSocketRooms,
  setNewAppointmentData
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
