import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    departmentData: null,
    departmentLoading: false,
    departmentPagination:{page:0,pageSize:10},
    designationData: null,
    designationLoading: false,
    designationPagination:{page:0,pageSize:10},
    specialityData: null,
    specialityLoading: false,
    specialityPagination:{page:0,pageSize:10},
    editData: null,
}

const hrSlice = createSlice({
    name:"hr",
    initialState,
    reducers : {
        setDepartmentData: (state, action) => {
                state.departmentData = action.payload
        },
        setDepartmentLoading: (state, action) => {
               state.departmentLoading = action.payload
         },
         setDepartmentPagination: (state, action) => {
                state.departmentPagination.page = action.payload.page;
                state.departmentPagination.pageSize = action.payload.pageSize
         },
        setDesignationData: (state, action) => {
                state.designationData = action.payload
         },
        setDesignationLoading: (state, action) => {
                state.designationLoading = action.payload
        },
        setDesignationPagination: (state, action) => {
                state.designationPagination.page = action.payload.page;
                state.designationPagination.pageSize = action.payload.pageSize
        },
        setSpecialityData: (state, action) => {
                state.specialityData = action.payload
        },
        setSpecialityLoading: (state, action) => {
                state.specialityLoading = action.payload
        },
        setSpecialityPagination: (state, action) => {
                state.specialityPagination.page = action.payload.page;
                state.specialityPagination.pageSize = action.payload.pageSize
        },
        setEditData : (state, action) => {
                state.editData = action.payload
        }
    }

})

export const { setDepartmentData,setDepartmentLoading,setDepartmentPagination,setDesignationData,setDesignationLoading,setDesignationPagination,setSpecialityData,setSpecialityLoading,setSpecialityPagination,setEditData } = hrSlice.actions;

export default hrSlice.reducer;