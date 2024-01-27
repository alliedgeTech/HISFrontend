import React, { createElement, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses, menuClasses,SidebarContext } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import menuItemClasses from './menu.module.css'
import { setCollapsed } from '../../slices/sidebar.slice';
import { useSiderbarData } from '../../services/Adminastrator/Sidebar';
import SidebarSkeleton from '../../Skeleton/SidebarSkeleton';
import * as MuiIcons from "@material-ui/icons";
import SearchIcon from '@mui/icons-material/Search';

function SidebarMenuItems({data}){
  console.log({data})
  return (
    <>

    <MenuItem><SearchIcon className={menuItemClasses.searchicon}/></MenuItem>

    <MenuItem style={{background:"#25396f",color:"white",borderRadius:"10px"}} component={<NavLink to={`/`}></NavLink>} icon={createElement(MuiIcons["HomeOutlined"])} className={menuItemClasses.op} > Dashboard </MenuItem>
      {
        data.map((navData,index) =>
        <SubMenu open={navData?.menuItems.find((data)=>data.link==window.location.pathname)} active={true} key={index} label={navData?.moduleName} className={menuItemClasses.menu_text} icon={createElement(MuiIcons["PersonOutline"])}>
          {
            navData.menuItems.map((menuData,i) =>
            {  
              const IconComponent = MuiIcons["LocalHospitalOutlined"];
                return IconComponent ? (
                  <MenuItem key={i} style={{ marginLeft: "0.5rem", height: "45px" }} component={<NavLink to={`${menuData.link}`}></NavLink>} icon={createElement(IconComponent)} className={[menuItemClasses.op,menuItemClasses.menu_text]}>{menuData?.menuName}</MenuItem>
                ) : null;
            }
            )
          }
      </SubMenu>
        )
      }
    </>
  )
}
// 'LocalHospitalOutlined' || 

export default function () {
  const dispatch = useDispatch();
  const { Loading, SidebarData } = useSiderbarData();
  const {collapsed} = useSelector(state => state.sidebar);
  useEffect(() => {
    let resize =  window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        dispatch(setCollapsed(false));
      } else {
        dispatch(setCollapsed(true));
      }
    });

    return () => {
      window.removeEventListener("resize", resize);
    }
  },[])
  return (
    <div className={`${menuItemClasses.sidebar_height}` } style={{ width: collapsed ? 'fit-content' : '285px' }}>

    <Sidebar
    collapsed={collapsed}
    
    collapsedWidth='90px'
    rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: 'white',
          padding:'0px 10px', 
          height:"100%",
        },
        [`.${menuClasses.container}`]:{
        }
      }}
    >
  <Menu
  closeOnClick={true}
     menuItemStyles={{  
        button: {
          // the active class will be added automatically by react router
          // so we can use it to style the active menu item
          [`&.active`]: {
            backgroundColor: 'rgba(19,57,94,0.1)',
            // color: '#b6c8d9',
          },
        },
      }}
  >
    {
      Loading ? <SidebarSkeleton/> : SidebarData && Array.isArray(SidebarData) && <SidebarMenuItems data={SidebarData} />
    }
  </Menu>
</Sidebar>
</div>
  )
}

