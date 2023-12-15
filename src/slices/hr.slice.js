import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    departmentData: null,
    departmentLoading: false,
    departmentPagination:{page:0,pageSize:10},
    departmentCount: null,
    designationData: null,
    designationLoading: false,
    designationPagination:{page:0,pageSize:10},
    designationCount: null,
    specialityData: null,
    specialityLoading: false,
    specialityCount: null,
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
         setDepartmentCount: (state, action) => {
                state.departmentCount = action.payload
         },
        setDesignationData: (state, action) => {
                state.designationData = action.payload
         },
        setDesignationLoading: (state, action) => {
                state.designationLoading = action.payload
        },
        setDesignationCount: (state, action) => {
                state.designationCount = action.payload
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
        setSpeciallityCount: (state, action) => {
                state.specialityCount = action.payload
        },
        setEditData : (state, action) => {
                state.editData = action.payload
        }
    }

})

export const { setDepartmentData,setDepartmentLoading,setDepartmentPagination,setDepartmentCount,setDesignationData,setDesignationCount,setDesignationLoading,setDesignationPagination,setSpecialityData,setSpeciallityCount,setSpecialityLoading,setSpecialityPagination,setEditData } = hrSlice.actions;

export default hrSlice.reducer;