import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    roleData: null,
    roleLoading: false,
    editRoleData: null,
    roleCount:null,
    rolePagination : {page:0,pageSize:10},
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
        setRolePagination : (state,action) => {
            state.rolePagination.page = action.payload.page;
            state.rolePagination.pageSize = action.payload.pageSize
        },
        setRoleCountByOne: (state, action) => { 
            state.roleCount = state.roleCount + 1;
        }
    }

})

export const { setRoleData,setRoleLoading,setroleEditData,setRoleCount,setRolePagination,setRoleCountByOne } = roleSlice.actions;

export default roleSlice.reducer;