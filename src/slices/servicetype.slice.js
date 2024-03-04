import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    serviceTypeData : null,
    serviceTypeLoading: false,
    editServiceTypeData: null,
    serviceTypeCount:null,
    serviceTypePagination: {page:0,pageSize:10},
    serviceTypeListLoading: true,
}

const serviceTypeSlice = createSlice({
    name:'servicetype',
    initialState,
    reducers:{
        setServiceTypeData (state, action) {
            state.serviceTypeData = action.payload;
        },
        setServiceTypeLoading(state,action) {
            state.serviceTypeLoading = action.payload;
        },
        setEditServiceTypeData (state,action) {
            state.editServiceTypeData = action.payload;
        },
        setServiceTypeCount(state,action) {
            state.serviceTypeCount = action.payload;
        },
        setServiceTypePagination(state,action) {
            state.serviceTypePagination.page = action.payload.page;
            state.serviceTypePagination.pageSize = action.payload.pageSize;
        },
        setServiceTypeCountIncByOne(state,action) {
            state.serviceTypeCount = state.serviceTypeCount + 1;
        },
        setServiceListLoading(state,action) {
            state.serviceTypeListLoading = action.payload
        }
    }
})

export const  { setServiceTypeData,setEditServiceTypeData,setServiceTypeCount,setServiceTypeLoading,setServiceTypePagination,setServiceTypeCountIncByOne,setServiceListLoading } = serviceTypeSlice.actions;

export default serviceTypeSlice.reducer;