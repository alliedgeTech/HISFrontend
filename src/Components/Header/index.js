import React from 'react'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import logo from '../../Assets/img/logo1_HIS.png';
import { useSelector,useDispatch } from 'react-redux';
import './header.css';
import { setCollapsed } from '../../slices/sidebar.slice';


export default  function() {
  const dispatch = useDispatch();
  const {collapsed} = useSelector(state => state.sidebar);

  return (
    <div className='main-header'>
       <div className='logo-text'>
            <div className='text'>eAarogyam</div>
        </div> 

        <div className='btn-bg' onClick={()=>dispatch(setCollapsed(!collapsed))}>
          <MenuOutlinedIcon />
        </div>

    </div>
  )
}

