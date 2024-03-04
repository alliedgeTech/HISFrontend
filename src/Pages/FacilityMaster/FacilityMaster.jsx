import React from 'react'
import CommonMaster from '../CommonMaster/CommonMaster'
import { useFacilityData } from '../../services/Add Master/FacilityMaster'
import { useDispatch, useSelector } from "react-redux";
import { setFacilityPagination, setfacilityEditData } from '../../slices/facility.slice';

function FacilityMaster() {
    const { createFacilityData,getFacilityData,updateFacilityData } = useFacilityData();
    const {facilityData,facilityPagination:paginationModel,facilityLoading,editFacilityData,facilityCount,facilityListLoading:ListLoading } = useSelector(state => state.facility);
    const dispatch = useDispatch();

  return (
    <CommonMaster 
        key={"facility"}
        MainValue={"facilityName"}
        Loading={facilityLoading}
        ListLoading={ListLoading}
        get={getFacilityData}
        add={createFacilityData}
        update={updateFacilityData}
        tableData={facilityData}
        paginationModel={paginationModel}
        setPaginationModal={ (data) => dispatch(setFacilityPagination(data))}
        editData={editFacilityData}
        setEditData={(data) => dispatch(setfacilityEditData(data))}
        FieldHeaderName={"Facility"}
        tableDataCount={facilityCount}
    />
    )
}

export default FacilityMaster