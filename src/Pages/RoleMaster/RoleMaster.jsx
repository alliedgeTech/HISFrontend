import React, { memo,useState } from 'react'
import { useRoleData } from '../../services/Adminastrator/RoleMaster';
import { useDispatch, useSelector } from 'react-redux';
import { setRolePagination } from '../../slices/role.slice';
import CommonMaster from '../CommonMaster/CommonMaster';

const RoleMaster =() => {
  const { Loading,addRole,updateRole,ListLoading,getRoleData } = useRoleData();
  const { roleData:RoleData,roleCount,rolePagination:paginationModel } = useSelector(state => state.role);
  const [editData, setEditData] = useState('');
  const dispatch = useDispatch();
  
  return (
    <>
        <CommonMaster 
        key={"role"}
        MainValue={"role"}
        Loading={Loading}
        ListLoading={ListLoading}
        get={getRoleData}
        add={addRole}
        update={updateRole}
        tableData={RoleData}
        paginationModel={paginationModel}
        setPaginationModal={ (data) => dispatch(setRolePagination(data))}
        editData={editData}
        setEditData={setEditData}
        FieldHeaderName={"Role"}
        tableDataCount={roleCount}
        />
             
    </>
  )
}


export default memo(RoleMaster);