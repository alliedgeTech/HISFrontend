import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    registrationData: null,
    registrationLoading: false,
    registrationEditData: null,
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
        }
    }

});

export const { setRegistrationData,setRegistrationLoading,setRegistrationEditData } = registrationSlice.actions;   

export default registrationSlice.reducer;