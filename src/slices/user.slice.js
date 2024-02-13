import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userData: null,
    userLoading: false,
    editUserData: null,
    userCount:null,
    userPaginaiton:{page:0,pageSize:10},
    userListLoading:true,
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
        },
        setUserCountIncByOne: (state, action) => {
            state.userCount = state.userCount + 1;
        },
        setUserListLoading: (state, action) => {
            state.userListLoading = action.payload
        }
    }

})

export const { setUserData,setUserLoading,setUserEditData,setUserCount,setUserPagination,setUserCountIncByOne,setUserListLoading } = userSlice.actions;

export default userSlice.reducer;