import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    categoryData: null,
    categoryEditData: null,
    actionLoading: false,
    categoryCount: null,
    categoryListLoading:true,
    categoryPagination: { page: 0, pageSize: 10 },
}


const categorySlice = createSlice({
    name:"category",
    initialState,
    reducers : {
        setCategoryData: (state, action) => {
            state.categoryData = action.payload
        },
        setCategoryListLoading: (state, action) => {
            state.categoryListLoading = action.payload
        },
        setCategoryEditData: (state, action) => {
            state.categoryEditData = action.payload
        },
        setActionLoading: (state, action) => {
            state.actionLoading = action.payload
        },
        setCategoryCount: (state, action) => {
            state.categoryCount = action.payload
        },
        setCategoryPagination: (state, action) => {
            state.categoryPagination.page = action.payload.page;
            state.categoryPagination.pageSize = action.payload.pageSize
        },
        setCategoryCountIncByOne: (state, action) => {
            state.categoryCount = state.categoryCount + 1;
        },
      
    }

})

export const { setCategoryData,setCategoryEditData,setActionLoading,setCategoryCount,setCategoryPagination,setCategoryCountIncByOne,setCategoryListLoading } = categorySlice.actions;

export default categorySlice.reducer;