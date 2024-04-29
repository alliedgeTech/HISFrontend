import React, { lazy, Suspense } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import NavigationScroll from './Components/Layouts/MinimalLayout';
import MainLayout from './Components/Layouts/MainLayout';
import CircularProgress from '@mui/material/CircularProgress';
import Page404 from './Pages/404Page/Page404';
import LoadingComponent from './Components/LoadingComponent/LoadingComponent';

// Lazy loaded components
const RoleMaster = lazy(() => import(/* webpackChunkName: "RoleMaster" */ './Pages/RoleMaster/RoleMaster'));
const UserMaster = lazy(() => import(/* webpackChunkName: "UserMaster" */ './Pages/UserMaster/UserMaster'));
const BranchMaster = lazy(() => import(/* webpackChunkName: "BranchMaster" */ './Pages/BranchMaster/BranchMaster'));
const CategoryMaster = lazy(() => import(/* webpackChunkName: "CategoryMaster" */ './Pages/CategoryMaster/CategoryMaster'));
const RegionMaster = lazy(() => import(/* webpackChunkName: "RegionMaster" */ './Pages/RegionMaster/RegionMaster'));
const HrMaster = lazy(() => import(/* webpackChunkName: "HrMaster" */ './Pages/HrMaster/HrMaster'));
const RegistrationMaster = lazy(() => import(/* webpackChunkName: "RegistrationMaster" */ './Pages/RegistrationMaster/RegistrationMaster'));
const DoctorCalender = lazy(() => import(/* webpackChunkName: "DoctorCalender" */ './Pages/DoctorCalender/DoctorCalender'));
const MainAppointment = lazy(() => import(/* webpackChunkName: "MainAppointment" */ './Pages/Appointment/MainAppointment'));
const ServiceTypeMaster = lazy(() => import(/* webpackChunkName: "ServiceTypeMaster" */ './Pages/ServiceTypeMaster/ServiceTypeMaster'));
const ServiceMaster = lazy(() => import(/* webpackChunkName: "ServiceMaster" */ './Pages/ServiceMaster/ServiceMaster'));
const FacilityMaster = lazy(() => import(/* webpackChunkName: "FacilityMaster" */ './Pages/FacilityMaster/FacilityMaster'));
const BedTypeMaster = lazy(() => import(/* webpackChunkName: "BedTypeMaster" */ './Pages/BedTypeMaster/BedTypeMaster'));
const UserTitleMaster = lazy(() => import(/* webpackChunkName: "UserTitleMaster" */ './Pages/UserTitleMaster/UserTitleMaster'));
const MainTarrif = lazy(() => import(/* webpackChunkName: "MainTarrif" */ './Pages/MainTarrif/MainTarrifMaster'));
const SocMaster = lazy(() => import(/* webpackChunkName: "SocMaster" */ './Pages/SocMaster/SocMaster'));
const MainSecretoryAppointment = lazy(() => import(/* webpackChunkName: "MainSecretoryAppointment" */ './Pages/SecretoryAppointment/MainSecretoryAppointment'));

function App() {
  return (
    <NavigationScroll>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/his' element={<MainLayout/>}>
            <Route path='/his/rolemaster' element={<Suspense fallback={<LoadingComponent/>}><RoleMaster/></Suspense>} />
            <Route path='/his/usermaster' element={<Suspense fallback={<LoadingComponent/>}><UserMaster/></Suspense>} />
            <Route path='/his/locationmaster' element={<Suspense fallback={<LoadingComponent/>}><BranchMaster/></Suspense>} />
            <Route path='/his/categorymaster' element={<Suspense fallback={<LoadingComponent/>}><CategoryMaster/></Suspense>} />
            <Route path='/his/regionmaster' element={<Suspense fallback={<LoadingComponent/>}><RegionMaster/></Suspense>} />
            <Route path='/his/facilitymaster' element={<Suspense fallback={<LoadingComponent/>}><FacilityMaster/></Suspense>} />
            <Route path='/his/servicetypemaster' element={<Suspense fallback={<LoadingComponent/>}><ServiceTypeMaster/></Suspense>} />
            <Route path='/his/tarrifmaster' element={<Suspense fallback={<LoadingComponent/>}><MainTarrif/></Suspense>} />
            <Route path='/his/hrmaster' element={<Suspense fallback={<LoadingComponent/>}><HrMaster/></Suspense>} />
            <Route path='/his/bedtypemaster' element={<Suspense fallback={<LoadingComponent/>}><BedTypeMaster/></Suspense>} />
            <Route path='/his/usertitlemaster' element={<Suspense fallback={<LoadingComponent/>}><UserTitleMaster/></Suspense>} />
            <Route path='/his/front-office/registration' element={<Suspense fallback={<LoadingComponent/>}><RegistrationMaster/></Suspense>} />
            <Route path='/his/front-office/secretorydashboard' element={<Suspense fallback={<LoadingComponent/>}><MainSecretoryAppointment/></Suspense>} />
            <Route path='/his/consultantdashboard/appointment' element={<Suspense fallback={<LoadingComponent/>}><MainAppointment/></Suspense>} />
            <Route path='/his/calender/doctor' element={<Suspense fallback={<LoadingComponent/>}><DoctorCalender/></Suspense>} />
            <Route path='/his/billing/servicemaster' element={<Suspense fallback={<LoadingComponent/>}><ServiceMaster/></Suspense>} />
            <Route path='/his/billing/socmaster' element={<Suspense fallback={<LoadingComponent/>}><SocMaster/></Suspense>} />
          </Route>  
            <Route path='*' element={<Page404/>} />
          
        </Routes>   
    </NavigationScroll>
  );
}

export default App;
