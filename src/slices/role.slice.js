import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    roleData: null,
    roleLoading: false,
    editRoleData: null,
    roleCount:null,
}

const roleSlice = createSlice({
    name:"role",
    initialState,
    reducers : {
        setRoleData: (state, action) => {
            state.roleData = action.payload
        },
        setRoleLoading: (state, action) => {
            state.roleLoading = action.payload
        },
        setroleEditData: (state, action) => {
            state.editRoleData = action.payload
        },
        setRoleCount : (state,action) => {
            state.roleCount = action.payload
        },
    }

})

export const { setRoleData,setRoleLoading,setroleEditData,setRoleCount} = roleSlice.actions;

export default roleSlice.reducer;