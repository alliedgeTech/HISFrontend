import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    bedTypeData: null,
    bedTypeLoading: false,
    editBedTypeData: null,
    bedTypeCount:null,
    bedTypePagination : {page:0,pageSize:10},
}

const bedTypeSlice = createSlice({
    name:'bedType',
    initialState,
    reducers : {
        setBedTypeData: (state, action) => {
            state.bedTypeData = action.payload
        },
        setBedTypeLoading: (state, action) => {
            state.bedTypeLoading = action.payload
        },
        setBedTypeEditData: (state, action) => {
            state.editBedTypeData = action.payload
        },
        setBedTypeCount : (state,action) => {
            state.bedTypeCount = action.payload
        },
        setBedTypePagination : (state,action) => {
            state.bedTypePagination.page = action.payload.page;
            state.bedTypePagination.pageSize = action.payload.pageSize
        },
        setBedTypeCountIncByOne: (state, action) => { 
            state.bedTypeCount = state.bedTypeCount + 1;
        }
    }
})

export const { setBedTypeData,setBedTypeLoading,setBedTypeEditData,setBedTypeCount,setBedTypePagination,setBedTypeCountIncByOne } = bedTypeSlice.actions;

export default bedTypeSlice.reducer;
