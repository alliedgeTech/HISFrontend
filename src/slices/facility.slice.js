import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    facilityData: null,
    facilityLoading: false,
    editFacilityData: null,
    facilityCount:null,
    facilityPagination : {page:0,pageSize:10},
}

const facilitySlice = createSlice({
    name:"facility",
    initialState,
    reducers : {
        setFacilityData: (state, action) => {
            state.facilityData = action.payload
        },
        setFacilityLoading: (state, action) => {
            state.facilityLoading = action.payload
        },
        setfacilityEditData: (state, action) => {
            state.editFacilityData = action.payload
        },
        setFacilityCount : (state,action) => {
            state.facilityCount = action.payload
        },
        setFacilityPagination : (state,action) => {

            state.facilityPagination.page = action.payload.page;
            state.facilityPagination.pageSize = action.payload.pageSize
        },
        setFacilityCountIncByOne: (state, action) => { 
            state.facilityCount = state.facilityCount + 1;
        }
    }

});

export const { setFacilityData,setFacilityLoading,setfacilityEditData,setFacilityCount,setFacilityPagination,setFacilityCountIncByOne } = facilitySlice.actions;

export default facilitySlice.reducer;