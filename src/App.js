import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import NavigationScroll from './Components/Layouts/MinimalLayout';
import MainLayout from './Components/Layouts/MainLayout';
import RoleMaster from './Pages/RoleMaster/RoleMaster';
import UserMaster from './Pages/UserMaster/UserMaster';
import BranchMaster from './Pages/BranchMaster/BranchMaster';
import CategoryMaster from './Pages/CategoryMaster/CategoryMaster';
import RegionMaster from './Pages/RegionMaster/RegionMaster';
import HrMaster from './Pages/HrMaster/HrMaster';
import RegistrationMaster from './Pages/RegistrationMaster/RegistrationMaster';
import Appointment from './Pages/Appointment/Appointment';
import DoctorCalender from './Pages/DoctorCalender/DoctorCalender';
import MainAppointment from './Pages/Appointment/MainAppointment';
import ServiceTypeMaster from './Pages/ServiceTypeMaster/ServiceTypeMaster';
import ServiceMaster from './Pages/ServiceMaster/ServiceMaster';
import FacilityMaster from './Pages/FacilityMaster/FacilityMaster';
import TarrifMaster from './Pages/TarrifMaster/TarrifMaster';
import BedTypeMaster from './Pages/BedTypeMaster/BedTypeMaster';
import UserTitleMaster from './Pages/UserTitleMaster/UserTitleMaster';
import TarrifWithService from './Pages/TarrifWithService/TarrifWithService';
import MainTarrif from './Pages/MainTarrif/MainTarrifMaster';
import SocMaster from './Pages/SocMaster/SocMaster';
import MainSecretoryAppointment from './Pages/Appointmentcopy/MainSecretoryAppointment';

function App() {
  return (
    <NavigationScroll>
      <Routes>
        <Route path='/' element={<MainLayout/>}>
          <Route path='/rolemaster' element={<RoleMaster/>} />
          <Route path='/usermaster' element={<UserMaster/>} />
          <Route path='/locationmaster' element={<BranchMaster/>} />
          <Route path='/categorymaster' element={<CategoryMaster/>} />
          <Route path='/regionmaster' element={<RegionMaster/>} />
          <Route path='/facilitymaster' element={<FacilityMaster/>} />
          <Route path='/servicetypemaster' element={<ServiceTypeMaster/>} />
          <Route path='/tarrifmaster' element={<MainTarrif/>} />
          <Route path='/hrmaster' element={<HrMaster/>} />
          <Route path='/bedtypemaster' element={<BedTypeMaster/>} />
          <Route path='/usertitlemaster' element={<UserTitleMaster/>} />
          <Route path='/front-office/registration' element={<RegistrationMaster/>} />
          <Route path='/front-office/secretorydashboard' element={<MainSecretoryAppointment/>} />
          <Route path='/consultantdashboard/appointment' element={<MainAppointment/>} />
          <Route path='/calender/doctor' element={<DoctorCalender/>} />
          <Route path='/billing/servicemaster' element={<ServiceMaster/>} />
          <Route path='/billing/socmaster' element={<SocMaster/>} />
          <Route path='*' element={<Home/>} />
        </Route>  
      </Routes>   
    </NavigationScroll>
  );
}

export default App;
  