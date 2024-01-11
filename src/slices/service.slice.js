import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    serviceData : null,
    serviceLoading: false,
    editServiceData: null,
    serviceCount:null,
    servicePagination: {page:0,pageSize:10},
}

const serviceSlice = createSlice({
    name:'service',
    initialState,
    reducers:{
        setServiceData (state, action) {
            state.serviceData = action.payload;
        },
        setServiceLoading(state,action) {
            state.serviceLoading = action.payload;
        },
        setEditServiceData (state,action) {
            state.editServiceData = action.payload;
        },
        setServiceCount(state,action) {
            state.serviceCount = action.payload;
        },
        setServicePagination(state,action) {
            state.servicePagination.page = action.payload.page;
            state.servicePagination.pageSize = action.payload.pageSize;
        },
        setServiceCountIncByOne(state,action) {
            state.serviceCount = state.serviceCount + 1;
        },
    }
})

export const  { setServiceData,setEditServiceData,setServiceCount,setServiceLoading,setServicePagination,setServiceCountIncByOne } = serviceSlice.actions;

export default serviceSlice.reducer;