import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    collapsed: window.innerWidth > 1024 ? false : true,
}

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        setCollapsed(state, action) {
            state.collapsed = action.payload;
        }
    }   
});

export const { setCollapsed } = sidebarSlice.actions;

export default sidebarSlice.reducer;