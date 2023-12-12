import { createSlice } from "@reduxjs/toolkit"

const initialState = {
   countryData: null,
   countryLoading: false,
   countryEditData: null,
   countryDropDownData: null,
   stateData: null,
   stateLoading: false,
   stateEditData: null,
   stateDropDownData: null,
   cityData: null,
   cityLoading: false,
   cityEditData: null,
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
        setCountryDropDownData: (state, action) => {
            state.countryDropDownData = action.payload
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
        setStateDropDownData: (state, action) => {
            state.stateDropDownData = action.payload
        },
        setCityData: (state, action) => {
            state.cityData = action.payload
        },
        setCityLoading: (state, action) => {
            state.cityLoading = action.payload
        },
        setCityEditData: (state, action) => {
            state.cityEditData = action.payload
        }
    }

})

export const { setCountryData,setCountryLoading,setCountryEditData,setCountryDropDownData,setStateData,setStateLoading,setStateEditData,setStateDropDownData,setCityData,setCityLoading,setCityEditData } = RegionSlice.actions;

export default RegionSlice.reducer;