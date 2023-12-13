import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    registrationData: null,
    registrationLoading: false,
    registrationEditData: null,
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
        }
    }

});

export const { setRegistrationData,setRegistrationLoading,setRegistrationEditData,setRegistrationPagination } = registrationSlice.actions;   

export default registrationSlice.reducer;