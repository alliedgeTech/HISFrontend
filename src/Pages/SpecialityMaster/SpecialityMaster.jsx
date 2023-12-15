import React, { useState } from 'react'
import { useHrMasterData } from '../../services/Add Master/HrMaster';
import { useDispatch, useSelector } from "react-redux";
import CommonMaster from '../CommonMaster/CommonMaster';
import { setSpecialityPagination } from '../../slices/hr.slice';

function SpecialityMaster() {
    const { Loding,getSpecilityData,createSpecility,updateSpecility } = useHrMasterData();
    const { specialityData,specialityPagination,specialityLoading,specialityCount } = useSelector(state => state.hr);
    const dispatch = useDispatch();
    const [EditData, setEditData] = useState(false);
  return (
    <>
        <CommonMaster
        key={"speciality"} 
        MainValue={"speciality"}
        Loading={Loding}
        ListLoading={specialityLoading}
        get={getSpecilityData}
        add={createSpecility}
        update={updateSpecility}
        tableData={specialityData}  
        paginationModel={specialityPagination}
        setPaginationModal={ (data) => dispatch(setSpecialityPagination(data))}
        editData={EditData}
        setEditData={setEditData}
        FieldHeaderName={"Speciality"}
        tableDataCount={specialityCount}
        customHeight={"248px"}
        />
    </>
  )
}   

export default SpecialityMaster