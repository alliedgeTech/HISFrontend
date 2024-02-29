import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    branchData: null,
    branchLoading: false,
    branchEditData: null,
    branchCount:null,
    branchPagination:{page:0,pageSize:10},
    branchListLoading:true
}

const branchSlice = createSlice({
    name:"branch",  
    initialState,
    reducers : {
        setBranchData: (state, action) => {
            state.branchData = action.payload
        },
        setBranchLoading: (state, action) => {
            state.branchLoading = action.payload
        },
        setBranchEditData: (state, action) => {
            state.branchEditData = action.payload
        },
        setBranchCount : (state,action) => {
            state.branchCount = action.payload
        },
        setBranchPagination : (state,action) => {
            state.branchPagination.page = action.payload.page;
            state.branchPagination.pageSize = action.payload.pageSize
        },
        setBranchCountIncByOne: (state, action) => {
            state.branchCount = state.branchCount + 1;
        },
        setBranchEmptyData : (state,action) => {
            state.branchCount = null;
            state.branchData = null;
            state.branchEditData = null;
        },
        setBranchListLoading: (state, action) => {
            state.branchListLoading = action.payload
        }
    }

})

export const { setBranchData,setBranchLoading,setBranchEditData,setBranchCount,setBranchPagination,setBranchCountIncByOne,setBranchEmptyData,setBranchListLoading } = branchSlice.actions;

export default branchSlice.reducer;