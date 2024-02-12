import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/user.slice";
import roleSlice from "../slices/role.slice";
import branchSlice from "../slices/branch.slice";
import regionSlice from "../slices/region.slice";
import hrSlice from "../slices/hr.slice";
import categorySlice from "../slices/category.slice";
import registrationSlice from "../slices/registration.slice";
import sidebarSlice from "../slices/sidebar.slice";
import appointmentSlice from "../slices/appointment.slice";
import doctorCalenderSlice from "../slices/doctorCalender.slice";
import socketSlice from "../slices/socket.slice";
import servicetypeSlice from "../slices/servicetype.slice";
import serviceSlice from "../slices/service.slice";
import facilitySlice from "../slices/facility.slice";
import tarrifSlice from "../slices/tarrif.slice";
import bedtypeSlice from "../slices/bedtype.slice";
import userTitleSlice from "../slices/userTitle.slice";
import socSlice from "../slices/soc.slice";

export const store = configureStore({
    reducer:{
        user: userSlice,
        userTitle: userTitleSlice,
        role: roleSlice,
        branch: branchSlice,
        region:regionSlice,
        hr:hrSlice,
        category:categorySlice,
        registration:registrationSlice,
        sidebar:sidebarSlice,
        appointment:appointmentSlice,
        doctorCalender:doctorCalenderSlice,
        socket:socketSlice,
        serviceType:servicetypeSlice,
        service:serviceSlice,
        facility:facilitySlice,
        tarrif:tarrifSlice,
        bedType:bedtypeSlice,
        soc: socSlice
    }
});