import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    categoryData: null,
    listLoading: true,
    categoryEditData: null,
    actionLoading: false,
    categoryCount: null,
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
    }

})

export const { setCategoryData,setListLoading,setCategoryEditData,setActionLoading,setCategoryCount } = categorySlice.actions;

export default categorySlice.reducer;