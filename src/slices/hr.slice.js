import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    departmentData: null,
    departmentLoading: false,
    designationData: null,
    designationLoading: false,
    specialityData: null,
    specialityLoading: false,
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
        setDesignationData: (state, action) => {
                state.designationData = action.payload
         },
        setDesignationLoading: (state, action) => {
                state.designationLoading = action.payload
        },
        setSpecialityData: (state, action) => {
                state.specialityData = action.payload
        },
        setSpecialityLoading: (state, action) => {
                state.specialityLoading = action.payload
        },
        setEditData : (state, action) => {
                state.editData = action.payload
        }
    }

})

export const { setDepartmentData,setDepartmentLoading,setDesignationData,setDesignationLoading,setSpecialityData,setSpecialityLoading,setEditData } = hrSlice.actions;

export default hrSlice.reducer;