import React from 'react'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { Outlet } from  'react-router-dom'

function MainLayout() {
  return (
    <div className='main-height'>
        <Header />
        <div className='sidebar-content'>
            <Sidebar />
            <div className='sidebar-content-padding'>
                <Outlet />
            </div>
        </div>
    </div>
  )
}

export default MainLayout