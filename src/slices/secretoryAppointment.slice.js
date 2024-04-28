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
  name: "secretoryAppointment",
  initialState,
  reducers: {
    setSecretoryAppointmentData: (state, action) => {
      state.appointmentData = action.payload;
    },
    setSecretoryAppointmentLoading: (state, action) => {
      state.appointmentLoading = action.payload;
    },
    setSecretoryAppointmentEditData: (state, action) => {
      state.appointmentEditData = action.payload;
    },
    setSecretoryAppointmentCount: (state, action) => {
      state.appointmentCount = action.payload;
    },
    setSecretoryAppointmentpagination: (state, action) => {
      state.appointmentPagination.page = action.payload.page;
      state.appointmentPagination.pageSize = action.payload.pageSize;
    },
    setSecretoryAppointmentBranch: (state,action) => {
      state.branch = action.payload;
    },
    setSecretoryStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setSecretoryEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setSecretoryNewAppointmentData: (state, action) => {
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
    setSecretoryRemoveAppointmentData: (state, action) => {
      if(Array.isArray(state.appointmentData) && state.appointmentData.length > 0) {
        state.appointmentData = state.appointmentData.filter((obj) => !action.payload.data.find((app_id) => app_id == obj._id));
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
    setSecretoryShowDoctorAppointment: (state, action) => {
      state.doctorAppointmentList = action.payload;
    },
    setSecretoryAppointmentStep: (state, action) => {
      state.appointmentStep = action.payload;
    },
    setSecretoryAppointmentJwtData: (state, action) => {
      state.appointmentJwtData = action.payload;
    },
    setSecretoryAppointmentOutTimeData: (state, action) => {
      state.appointmentOutTimeData = action.payload;
    },
    setSecretoryAppointmentListLoading: (state, action) => {
      state.appointmentListLoading = action.payload;
    },
    setSecretoryAppointmentUpdatedData: (state, action) => {
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
    setSecretoryNewDataAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
        !state.appointmentJwtData.find(
          (data) => data._id === action.payload._id
        ) && state.appointmentJwtData.push(action.payload);
      } else {
        state.appointmentJwtData = [action.payload];
      }
    },
    setSecretoryUpdatedAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
          state.appointmentJwtData = state.appointmentJwtData.map((data) => {
          const findUpdatedAppointment = action.payload.find((updatedData)=> updatedData._id == data._id );
          if(findUpdatedAppointment) {
             data = { ...data, ...findUpdatedAppointment };
          }
          return data;
        });
      }
    },
    setSecretoryRemovedAppointmentJwtData: (state, action) => {
      if (Array.isArray(state.appointmentJwtData)) {
        state.appointmentJwtData = state.appointmentJwtData.filter((currentAppointment) =>
           !action.payload.find((filteredAppointment)=> filteredAppointment == currentAppointment._id)
        );
        if(state.appointmentJwtData?.length === 0) {
          state.appointmentJwtData = null;
        } else {
          state.appointmentCount -= 1;
        }
      }
    },
    setSecretoryNewAppointmentOutTimeData: (state, action) => {
      if (action.payload && Array.isArray(state.appointmentOutTimeData)) {
        !state.appointmentOutTimeData.find(
          (obj) => obj._id === action.payload._id
        ) && state.appointmentOutTimeData.push(action.payload);
      } else {
        state.appointmentOutTimeData = [action.payload];
      }
    },
    setSecretoryAppointmentCurrentSocketRooms: (state, action) => {
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

      console.log("this is startTime : ",startDate, "this is end date : ",endDate," this is doctorId : ",doctorId," this is branchId : ",branchId);

      if(startDate && endDate && branchId) {
        const dateArray = [];

        // Convert startDate and endDate to Date objects
        startDate = new Date(startDate);
        endDate = new Date(endDate);
  
        // Include startDate and endDate in the array
        if (startDate.getTime() === endDate.getTime()) {
            const key = doctorId ? doctorId + "_" + new Date(startDate).toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment" : "_" + new Date(startDate).toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment";
            dateArray.push(key); 
        } else {
          // Loop through dates from startDate to endDate
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            const key = doctorId ? doctorId + "_" + currentDate.toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment" : "_" + currentDate.toLocaleDateString("en-CA") + "_" + branchId + "_" + "appointment" ;
            dateArray.push(key); 
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        state.appointmentCurrentSocketRooms = dateArray;
        console.log("this is joinroom date : ",dateArray);
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
  setSecretoryAppointmentpagination,
  setSecretoryRemoveAppointmentData,
  setSecretoryAppointmentBranch,
  setSecretoryStartDate,
  setSecretoryEndDate,
  setSecretoryShowDoctorAppointment,
  setSecretoryAppointmentJwtData,
  setSecretoryAppointmentOutTimeData,
  setSecretoryAppointmentStep,
  setSecretoryAppointmentListLoading,
  setSecretoryAppointmentUpdatedData,
  setSecretoryNewDataAppointmentJwtData,
  setSecretoryUpdatedAppointmentJwtData,
  setSecretoryRemovedAppointmentJwtData,
  setSecretoryNewAppointmentOutTimeData,
  setSecretoryAppointmentCurrentSocketRooms,
  setSecretoryNewAppointmentData
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
