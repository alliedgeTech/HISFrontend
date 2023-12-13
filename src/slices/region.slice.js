import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   countryData: null,
   countryLoading: false,
   countryEditData: null,
   countryPagination : {page:0,pageSize:10},
   countryCount: null,
   stateData: null,
   stateLoading: false,
   stateEditData: null,
   statePagintion: {page:0,pageSize:10},
   stateCount: null,
   cityData: null,
   cityLoading: false,
   cityEditData: null,
   cityPagination: {page:0,pageSize:10},
   cityCount: null
}

const RegionSlice = createSlice({
    name:"region",
    initialState,
    reducers : {
        setCountryData: (state, action) => {
            state.countryData = action.payload
        },
        setCountryLoading: (state, action) => {
            state.countryLoading = action.payload
        },
        setCountryEditData: (state, action) => {
            state.countryEditData = action.payload
        },
        setCountryPagination: (state, action) => {
            state.countryPagination.page = action.payload.page;
            state.countryPagination.pageSize = action.payload.pageSize
        },
        setCountryCount : (state,action) => {
            state.countryCount = action.payload
        },
        setStateData: (state, action) => {
            state.stateData = action.payload
        },
        setStateLoading: (state, action) => {
            state.stateLoading = action.payload
        },
        setStateEditData: (state, action) => {
            state.stateEditData = action.payload
        },
        setStatePagination: (state, action) => {
            state.statePagintion.page = action.payload.page;
            state.statePagintion.pageSize = action.payload.pageSize
        },
        setStateCount : (state,action) => {
            state.stateCount = action.payload
        },
        setCityData: (state, action) => {
            state.cityData = action.payload
        },
        setCityLoading: (state, action) => {
            state.cityLoading = action.payload
        },
        setCityEditData: (state, action) => {
            state.cityEditData = action.payload
        },
        setCityPagination : (state,action) => {
            state.cityPagination.page = action.payload.page;
            state.cityPagination.pageSize = action.payload.pageSize
        },
        setCityCount : (state,action) => {
            state.cityCount = action.payload
        }
    }

})

export const { setCountryData,setCountryLoading,setCountryEditData,setCountryPagination,setCountryCount,setStateData,setStateLoading,setStateEditData,setStatePagination,setStateCount,setCityData,setCityLoading,setCityEditData,setCityPagination,setCityCount } = RegionSlice.actions;

export default RegionSlice.reducer;