import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    registrationData: null,
    registrationLoading: false,
    registrationEditData: null,
    registrationCount:null,
    registrationPagination:{page:0,pageSize:10},
    registrationListLoading:true,
}

const registrationSlice = createSlice({
    name:"registration",
    initialState,
    reducers : {
        setRegistrationData: (state, action) => {
            state.registrationData = action.payload
        },
        setRegistrationLoading: (state, action) => {
            state.registrationLoading = action.payload
        },
        setRegistrationEditData: (state, action) => {
            state.registrationEditData = action.payload
        },
        setRegistrationPagination : (state,action) => {
            state.registrationPagination.page = action.payload.page;
            state.registrationPagination.pageSize = action.payload.pageSize
        },
        setRegistrationCount : (state,action) => {
            state.registrationCount = action.payload;
        },
        setRegistrationCountIncByOne: (state, action) => {
            state.registrationCount = state.registrationCount + 1;
        },
        setRegistrationEmptyData : (state,action) => {
            state.registrationCount = null;
            state.registrationData = null;        
        },
        setRegistrationListLoading:(state,action) => {
            state.registrationListLoading = action.payload;
        }
    }

});

export const { setRegistrationData,setRegistrationLoading,setRegistrationEditData,setRegistrationPagination,setRegistrationCount,setRegistrationCountIncByOne,setRegistrationEmptyData,setRegistrationListLoading } = registrationSlice.actions;   

export default registrationSlice.reducer;