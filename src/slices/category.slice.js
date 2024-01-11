import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    categoryData: null,
    listLoading: true,
    categoryEditData: null,
    actionLoading: false,
    categoryCount: null,
    categoryPagination: { page: 0, pageSize: 10 },
}


const categorySlice = createSlice({
    name:"category",
    initialState,
    reducers : {
        setCategoryData: (state, action) => {
            state.categoryData = action.payload
        },
        setListLoading: (state, action) => {
            state.listLoading = action.payload
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
        }
    }

})

export const { setCategoryData,setListLoading,setCategoryEditData,setActionLoading,setCategoryCount,setCategoryPagination,setCategoryCountIncByOne } = categorySlice.actions;

export default categorySlice.reducer;