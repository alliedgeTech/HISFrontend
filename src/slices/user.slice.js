import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userData: null,
    userLoading: false,
    editUserData: null,
    userCount:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers : {
        setUserData: (state, action) => {
            state.userData = action.payload
        },
        setUserLoading: (state, action) => {
            state.userLoading = action.payload
        },
        setUserEditData: (state, action) => {
            state.editUserData = action.payload
        },
        setUserCount: (state, action) => {  
            state.userCount = action.payload
        }
    }

})

export const { setUserData,setUserLoading,setUserEditData,setUserCount } = userSlice.actions;

export default userSlice.reducer;