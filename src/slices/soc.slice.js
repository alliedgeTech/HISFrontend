import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    socData: null,
    socLoading: false,
    editSocData: null,
    socCount:null,
    socPagination : {page:0,pageSize:10},
    bedTypeData: null,
    socListLoading:true,
}

const roleSlice = createSlice({
    name:"soc",
    initialState,
    reducers : {
        setBedTypeData:(state,action) => {
            state.bedTypeData = action.payload
        },
        setSocData: (state, action) => {
            state.socData = action.payload
        },
        setSocLoading: (state, action) => {
            state.socLoading = action.payload
        },
        setSocEditData: (state, action) => {
            state.editSocData = action.payload
        },
        setSocCount : (state,action) => {
            state.socCount = action.payload
        },
        setSocPagination : (state,action) => {
            state.socPagination.page = action.payload.page;
            state.socPagination.pageSize = action.payload.pageSize
        },
        setSocCountIncByOne: (state, action) => { 
            state.socCount = state.roleCount + 1;
        },
        setSocListLoading: (state,action) => {
            state.socListLoading = action.payload
        }
    }

})

export const { setSocCountIncByOne,setSocCount,setSocData,setSocEditData,setSocLoading,setSocPagination,setBedTypeData,setSocListLoading } = roleSlice.actions;

export default roleSlice.reducer;