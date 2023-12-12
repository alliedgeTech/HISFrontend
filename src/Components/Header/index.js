import React from 'react'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import logo from '../../logo.svg';
import { useSelector,useDispatch } from 'react-redux';
import './header.css';
import { setCollapsed } from '../../slices/sidebar.slice';


export default  function() {
  const dispatch = useDispatch();
  const {collapsed} = useSelector(state => state.sidebar);

  return (
    <div className='main-header'>
       <div className='logo-text'>
            <img src= {logo} width={60}/>
            <div className='text'>HIS.In</div>
        </div> 

        <div className='btn-bg' onClick={()=>dispatch(setCollapsed(!collapsed))}>
          <MenuOutlinedIcon />
        </div>

    </div>
  )
}

