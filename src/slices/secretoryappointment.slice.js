import { createSlice } from "@reduxjs/toolkit";
import socket from "../socket";

const initialState = {
  secretoryAppointmentData: null,
  secretoryAppointmentLoading: false,
  secretoryAppointmentEditData: null,
  secretoryAppointmentCount: null,
  secretoryAppointmentPagination: { page: 0, pageSize: 10 },
  secretoryStartDate: new Date().toLocaleDateString("en-CA").toString(),
  secretoryEndDate: new Date().toLocaleDateString("en-CA").toString(),
  doctorSecretoryAppointmentList: null,
  secretoryAppointmentStep: 0,
  secretoryAppointmentJwtData: null,
  secretoryAppointmentOutTimeData: null,
  secretoryAppointmentListLoading: false,
  secretoryAppointmentCurrentSocketRooms: null,
};

const secretoryAppointmentSlice = createSlice({
  name: "secretoryAppointment",
  initialState,
  reducers: {
    setSecretoryAppointmentData: (state, action) => {
      state.secretoryAppointmentData = action.payload;
    },
    setSecretoryAppointmentLoading: (state, action) => {
      state.secretoryAppointmentLoading = action.payload;
    },
    setSecretoryAppointmentEditData: (state, action) => {
      state.secretoryAppointmentEditData = action.payload;
    },
    setSecretoryAppointmentCount: (state, action) => {
      state.secretoryAppointmentCount = action.payload;
    },
    setSecretoryAppointmentPagination: (state, action) => {
      state.secretoryAppointmentPagination.page = action.payload.page;
      state.secretoryAppointmentPagination.pageSize = action.payload.pageSize;
    },
    setSecretoryStartDate: (state, action) => {
      state.secretoryStartDate = action.payload;
    },
    setSecretoryEndDate: (state, action) => {
      state.secretoryEndDate = action.payload;
    },
    setDoctorSecretoryAppointmentList: (state, action) => {
      state.doctorSecretoryAppointmentList = action.payload;
    },
    setNewSecretoryAppointmentData: (state, action) => {
        if(Array.isArray(state.secretoryAppointmentData)) {
             if( state.secretoryAppointmentData.length < state.secretoryAppointmentPagination.pageSize ){
                if(state.secretoryAppointmentData.findIndex((obj) => obj._id === action.payload._id) === -1) {
                  state.secretoryAppointmentData.push(action.payload);
                  state.secretoryAppointmentCount += 1;
                }
             } else {
                state.secretoryAppointmentCount += 1;
             }
                 
        } else {
            state.secretoryAppointmentData = [action.payload];
        }   
    },
    setRemoveSecretoryAppointmentData: (state, action) => {
      if(Array.isArray(state.secretoryAppointmentData) && state.secretoryAppointmentData.length > 0) {
        state.secretoryAppointmentData = state.secretoryAppointmentData.filter((obj) => obj._id !== action.payload);
      }
      if(state.secretoryAppointmentData.length === 0) {
        if(state.secretoryAppointmentPagination.page >= 1) {
          let count = state.secretoryAppointmentPagination.page;
          state.secretoryAppointmentCount -= 1;
          typeof action.payload.getAppintmentData === 'function' && queueMicrotask(()=> action.payload.getAppintmentData(true,count-1)) 
        } else {
          state.appointmentData = null;
          state.appointmentCount = 0;
        }
      } else {
        state.secretoryAppointmentCount -= 1;
      }
    },
    setSecretoryAppointmentStep: (state, action) => {
      state.secretoryAppointmentStep = action.payload;
    },
    setSecretoryAppointmentJwtData: (state, action) => {
      state.secretoryAppointmentJwtData = action.payload;
    },
    setSecretoryAppointmentOutTimeData: (state, action) => {
      state.secretoryAppointmentOutTimeData = action.payload;
    },
    setSecretoryAppointmentListLoading: (state, action) => {
      state.secretoryAppointmentListLoading = action.payload;
    },
    setSecretoryAppointmentUpdatedData: (state, action) => {
      let newData = action.payload;
      if (Array.isArray(state.secretoryAppointmentData)) {
        state.secretoryAppointmentData = state.secretoryAppointmentData.map((data) =>
          data._id === newData._id ? { ...data, ...newData } : data
        );
      }
    },
    setNewDataSecretoryAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.secretoryAppointmentJwtData)) {
        !state.secretoryAppointmentJwtData.find(
          (data) => data._id === action.payload._id
        ) && state.secretoryAppointmentJwtData.push(action.payload);
      } else {
        state.secretoryAppointmentJwtData = [action.payload];
      }
    },
    setUpdatedSecretoryAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.secretoryAppointmentJwtData)) {
        state.secretoryAppointmentJwtData = state.secretoryAppointmentJwtData.map((data) =>
          data._id === action.payload._id
            ? { ...data, ...action.payload }
            : data
        );
      }
    },
    setRemovedSecretoryAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.secretoryAppointmentJwtData)) {
        state.secretoryAppointmentJwtData = state.secretoryAppointmentJwtData.filter(
          (data) => data._id !== action.payload
        );
        if(state.secretoryAppointmentJwtData?.length === 0) {
          state.secretoryAppointmentJwtData = null;
        } else {
          state.secretoryAppointmentCount -= 1;
        }
      }
    },
    setNewSecretoryAppointmentOutTimeData: (state, action) => {
      if (action.payload && Array.isArray(state.secretoryAppointmentOutTimeData)) {
        !state.secretoryAppointmentOutTimeData.find(
          (obj) => obj._id === action.payload._id
        ) && state.secretoryAppointmentOutTimeData.push(action.payload);
      } else {
        state.secretoryAppointmentOutTimeData = [action.payload];
      }
    },
    setSecretoryAppointmentCurrentSocketRooms: (state, action) => {
        console.log("!@# step 2 : i am start to leave the room : ", state.secretoryAppointmentCurrentSocketRooms);
      if (
        Array.isArray(state.secretoryAppointmentCurrentSocketRooms) &&
        state.secretoryAppointmentCurrentSocketRooms.length > 0
      ) {
        socket.emit("leaveRoom", state.secretoryAppointmentCurrentSocketRooms);
      }
      let startDate = action.payload?.startDate;
      let endDate = action.payload?.endDate;
      let doctorId = action.payload?.doctorId;


      if(startDate && endDate ) {
        const dateArray = [];

        // Convert startDate and endDate to Date objects
        startDate = new Date(startDate);
        endDate = new Date(endDate);
  
        // Include startDate and endDate in the array
        if (startDate.getTime() === endDate.getTime()) {
         doctorId ? dateArray.push(doctorId + "_" + startDate.toISOString().split("T")[0]) : dateArray.push(startDate.toISOString().split("T")[0]); 
        } else {
          // Loop through dates from startDate to endDate
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            doctorId ? dateArray.push(
              doctorId + "_" + currentDate.toISOString().split("T")[0]
            ) :  dateArray.push(currentDate.toISOString().split("T")[0]) ; 
            currentDate.setDate(currentDate.getDate() + 1);
          }
        } 
        console.log("!@# step 3 : i am storing this rooms : ",dateArray);
        state.secretoryAppointmentCurrentSocketRooms = dateArray;
        socket.emit("joinRoom", dateArray);
      } 
    },
  },
});

export const {
  setSecretoryAppointmentCount,
  setSecretoryAppointmentData,
  setSecretoryAppointmentEditData,
  setSecretoryAppointmentLoading,
  setSecretoryAppointmentPagination,
  setSecretoryStartDate,
  setSecretoryEndDate,
  setNewSecretoryAppointmentData,
  setRemoveSecretoryAppointmentData,
  setDoctorSecretoryAppointmentList,
  setSecretoryAppointmentStep,
  setSecretoryAppointmentJwtData,
  setSecretoryAppointmentOutTimeData,
  setSecretoryAppointmentListLoading,
  setSecretoryAppointmentUpdatedData,
  setNewDataSecretoryAppointmentJwtData,
  setUpdatedSecretoryAppointmentJwtData,
  setRemovedSecretoryAppointmentJwtData,
  setNewSecretoryAppointmentOutTimeData,
  setSecretoryAppointmentCurrentSocketRooms
  } = secretoryAppointmentSlice.actions;
  
  export default secretoryAppointmentSlice.reducer;
  