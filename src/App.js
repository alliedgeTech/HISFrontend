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

function App() {
  return (
    <NavigationScroll>
      <Routes>
        <Route path='/' element={<MainLayout/>} >
          <Route path='/' element={null} />
          <Route path='/rolemaster' element={<RoleMaster/>} />
          <Route path='/usermaster' element={<UserMaster/>} />
          <Route path='/locationmaster' element={<BranchMaster/>} />
          <Route path='/categorymaster' element={<CategoryMaster/>} />
          <Route path='/regionmaster' element={<RegionMaster/>} />
          <Route path='/facilitymaster' element={<FacilityMaster/>} />
          <Route path='/servicetypemaster' element={<ServiceTypeMaster/>} />
          <Route path='/tarrifmaster' element={<TarrifMaster/>} />
          <Route path='/hrmaster' element={<HrMaster/>} />
          <Route path='/front-office/registration' element={<RegistrationMaster/>} />
          <Route path='/consultantdashboard/appointment' element={<MainAppointment/>} />
          <Route path='/calender/doctor' element={<DoctorCalender/>} />
          <Route path='/billing/servicemaster' element={<ServiceMaster/>} />
          <Route path='*' element={<Home/>} />
        </Route>  
      </Routes>   
    </NavigationScroll>
  );
}

export default App;
  