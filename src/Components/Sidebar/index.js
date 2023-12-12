import React, { createElement, useEffect } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses, menuClasses,SidebarContext } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import './menu.css'
import { setCollapsed } from '../../slices/sidebar.slice';
import { useSiderbarData } from '../../services/Adminastrator/Sidebar';
import SidebarSkeleton from '../../Skeleton/SidebarSkeleton';
import * as MuiIcons from "@material-ui/icons";
// createElement(Icons["PersonAddAltIcon"])




function SidebarMenuItems({data}){
  return (
    <>
      {
        data.map((navData,index) =>
        <SubMenu key={index} label={navData?.moduleName} className='menu-text' icon={createElement(MuiIcons["PersonOutline"])}>
          {
            navData.menuItems.map((menuData,i) =>
            <MenuItem key={i} style={{marginLeft:"0.5rem"}} component={<NavLink to={`${menuData.link}`}></NavLink>} icon={createElement(MuiIcons["LocalHospitalOutlined"])} className='menu-text op'>{menuData?.menuName} </MenuItem>
            )
          }
      </SubMenu>
        )
      }
    </>
  )
}


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
    <div className='sidebar-height'>

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
            // 
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

