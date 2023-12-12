import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import NavigationScroll from './Components/Layouts/MinimalLayout';
import MainLayout from './Components/Layouts/MainLayout';
import RoleMaster from './Pages/RoleMaster/RoleMaster';
import UserMaster from './Pages/UserMaster/UserMaster';
import BranchMaster from './Pages/BranchMaster/BranchMaster';
import CategoryMaster from './Pages/CategoryMaster/CategoryMaster';
// import * as RegularIcons from '@fortawesome/free-regular-svg-icons';

// const iconList = Object.keys(Icons)
//   .filter((key) => key !== 'fas' && key !== 'prefix')
//   .map((icon) => Icons[icon]);


function App() {
  return (
    <NavigationScroll>
      <Routes>
        <Route path='/' element={<MainLayout/>} >
          <Route path='/rolemaster' element={<RoleMaster/>} />
          <Route path='/usermaster' element={<UserMaster/>} />
          <Route path='/locationmaster' element={<BranchMaster/>} />
          <Route path='/categorymaster' element={<CategoryMaster/>} />
          <Route path='*' element={<Home/>} />
        </Route>  
      </Routes>   
    </NavigationScroll>
  );
}

export default App;
  