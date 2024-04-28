import React from 'react'
import EmptyData from '../../Components/NoData/EmptyData'
import Header from '../../Components/Header'
import Sidebar from '../../Components/Sidebar'
import CustomButton from '../../Components/Button/Button'
import { useNavigate } from 'react-router-dom'

function Page404() {
        const navigate = useNavigate();
    return (
    <div className='main-height'>
        <Header />
        <div className='sidebar-content'>
            <Sidebar />
            <div className='sidebar-content-padding'>
                <EmptyData />
                <div style={{display:"flex",justifyContent:'center'}}>
                <CustomButton buttonText={"Go Home Page"} onClick={()=>navigate("/his")} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Page404
