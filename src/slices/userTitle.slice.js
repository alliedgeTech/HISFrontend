import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userTitleData: null,
    userTitleLoading: false,
    editUserTitleData: null,
    userTitleCount:null,
    userTitlePaginaiton:{page:0,pageSize:10},
}

const userTitleSlice = createSlice({
    name:"userTitle",
    initialState,
    reducers:{
        setUserTitleData:(state,action) => {
            state.userTitleData = action.payload;
        },
        setUserTitleLoading: (state, action) => {
            state.userTitleLoading = action.payload
        },
        setUserTitleEditData: (state, action) => {
            state.editUserTitleData = action.payload
        },
        setUserTitleCount: (state, action) => {  
            state.userTitleCount = action.payload
        },
        setUserTitlePagination : (state,action) => {
            state.userTitlePaginaiton.page = action.payload.page;
            state.userTitlePaginaiton.pageSize = action.payload.pageSize
        },
        setUserTitleCountIncByOne: (state, action) => {
            state.userTitleCount = state.userCount + 1;
        }
    }
});

export const  { setUserTitleCount,setUserTitleCountIncByOne,setUserTitleData,setUserTitleEditData,setUserTitleLoading,setUserTitlePagination }  = userTitleSlice.actions;

export default userTitleSlice.reducer;