import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userData: null,
    userLoading: false,
    editUserData: null,
    userCount:null,
    userPaginaiton:{page:0,pageSize:10},
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
        },
        setUserPagination : (state,action) => {
            state.userPaginaiton.page = action.payload.page;
            state.userPaginaiton.pageSize = action.payload.pageSize
        }
    }

})

export const { setUserData,setUserLoading,setUserEditData,setUserCount,setUserPagination } = userSlice.actions;

export default userSlice.reducer;