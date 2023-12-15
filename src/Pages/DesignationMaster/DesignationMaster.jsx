import React, { useState } from 'react'
import { useHrMasterData } from '../../services/Add Master/HrMaster';
import { useDispatch, useSelector } from 'react-redux';
import CommonMaster from '../CommonMaster/CommonMaster';
import { setDesignationPagination } from '../../slices/hr.slice';

function DesignationMaster() {
    const { Loding,getDesignationData,createDesignation,updateDesignation } = useHrMasterData();
    const { designationData,designationPagination,designationLoading,designationCount } = useSelector(state => state.hr);
    const dispatch = useDispatch();
    const [EditData, setEditData] = useState(false);
  return (
    <CommonMaster
    key={"designation"} 
    MainValue={"designation"}
    Loading={Loding}
    ListLoading={designationLoading}
    get={getDesignationData}
    add={createDesignation}
    update={updateDesignation}
    tableData={designationData}
    paginationModel={designationPagination}
    setPaginationModal={ (data) => dispatch(setDesignationPagination(data))}
    editData={EditData}
    setEditData={setEditData}
    FieldHeaderName={"Designation"}
    tableDataCount={designationCount}
    customHeight={"248px"}
    />
  )
}

export default DesignationMaster