import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    branchData: null,
    branchLoading: false,
    branchEditData: null,
    branchCount:null,
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
    }

})

export const { setBranchData,setBranchLoading,setBranchEditData,setBranchCount } = branchSlice.actions;

export default branchSlice.reducer;