import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tarrifData: null,
  tarrifLoading: false,
  editTarrifData: null,
  tarrifCount: null,
  tarrifPagination: {
    page: 0,
    pageSize: 10,
  },
  tarrifWithServiceData: null,
  tarrifWithServiceLoading: false,
  editTarrifWithServiceData: null,
  tarrifWithServiceCount: null,
  tarrifWithServicePagination: {
    page: 0,
    pageSize: 10,
  },
};

const tarrifSlice = createSlice({
  name: "tarrif",
  initialState,
  reducers: {
    setTarrifData: (state, action) => {
      state.tarrifData = action.payload;
    },
    setTarrifLoading: (state, action) => {
      state.tarrifLoading = action.payload;
    },
    setTarrifEditData: (state, action) => {
      state.editTarrifData = action.payload;
    },
    setTarrifCount: (state, action) => {
      state.tarrifCount = action.payload;
    },
    setTarrifPagination: (state, action) => {
      state.tarrifPagination.page = action.payload.page;
      state.tarrifPagination.pageSize = action.payload.pageSize;
    },
    setTarrifCountIncByOne: (state, action) => {
      state.tarrifCount = state.tarrifCount + 1;
    },
    setTarrifWithServiceData: (state, action) => {
      state.tarrifWithServiceData = action.payload;
    },
    setTarrifWithServiceLoading: (state, action) => {
      state.tarrifWithServiceLoading = action.payload;
    },
    setTarrifWithServiceEditData: (state, action) => {
      state.editTarrifWithServiceData = action.payload;
    },
    setTarrifWithServiceCount: (state, action) => {
      state.tarrifWithServiceCount = action.payload;
    },
    setTarrifWithServicePagination: (state, action) => {
      state.tarrifWithServicePagination.page = action.payload.page;
      state.tarrifWithServicePagination.pageSize = action.payload.pageSize;
    },
    setTarrifWithServiceCountIncByOne: (state, action) => {
      state.tarrifCount = state.tarrifCount + 1;
    },
  },
});

export const {
  setTarrifData,
  setTarrifLoading,
  setTarrifEditData,
  setTarrifCount,
  setTarrifPagination,
  setTarrifCountIncByOne,

  setTarrifWithServiceCount,
  setTarrifWithServiceCountIncByOne,
  setTarrifWithServiceData,
  setTarrifWithServiceEditData,
  setTarrifWithServiceLoading,
  setTarrifWithServicePagination
} = tarrifSlice.actions;

export default tarrifSlice.reducer;
