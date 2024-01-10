import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    registrationData: null,
    registrationLoading: false,
    registrationEditData: null,
    registrationCount:null,
    registrationPagination:{page:0,pageSize:10},
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
        setRegistrationCountByOne: (state, action) => {
            state.registrationCount = state.registrationCount + 1;
        }
    }

});

export const { setRegistrationData,setRegistrationLoading,setRegistrationEditData,setRegistrationPagination,setRegistrationCount,setRegistrationCountByOne } = registrationSlice.actions;   

export default registrationSlice.reducer;