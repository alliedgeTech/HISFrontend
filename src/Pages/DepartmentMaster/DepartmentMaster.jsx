import React, { useState } from 'react'
import { useHrMasterData } from '../../services/Add Master/HrMaster';
import { useDispatch, useSelector } from "react-redux";
import CommonMaster from '../CommonMaster/CommonMaster';
import { setDepartmentPagination } from '../../slices/hr.slice';

function DepartmentMaster() {
    const { Loding,getDepartmentData,addDepartmentData,updateDepartmentData } = useHrMasterData();
    const { departmentData,departmentPagination,departmentLoading,departmentCount } = useSelector(state => state.hr);
    const dispatch = useDispatch();
    const [EditData, setEditData] = useState(false);

  return (
    <CommonMaster
        key={"department"} 
        MainValue={"department"}
        Loading={Loding}
        ListLoading={departmentLoading}
        get={getDepartmentData}
        add={addDepartmentData}
        update={updateDepartmentData}
        tableData={departmentData}  
        paginationModel={departmentPagination}
        setPaginationModal={ (data) => dispatch(setDepartmentPagination(data))}
        editData={EditData}
        setEditData={setEditData}
        FieldHeaderName={"Department"}
        tableDataCount={departmentCount}
        customHeight={"248px"}
        />
  )
}

export default DepartmentMaster;