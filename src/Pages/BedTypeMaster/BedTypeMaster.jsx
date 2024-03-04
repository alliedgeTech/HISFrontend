import React from 'react'
import CommonMaster from '../CommonMaster/CommonMaster'
import { useBedType } from '../../services/Add Master/BedTypeMaster'
import { setBedTypeEditData, setBedTypePagination } from '../../slices/bedtype.slice';
import { useDispatch, useSelector } from "react-redux";

function BedTypeMaster() {
        const { createBedType,getBedTypeData,updateBedType } = useBedType();
        const { bedTypeData,bedTypeLoading,editBedTypeData,bedTypeCount,bedTypePagination:paginationModel,bedTypeListLoading:ListLoading } = useSelector(state => state.bedType)
        const dispatch =  useDispatch();
  return (
    <CommonMaster 
    key={"bedtype"}
    MainValue={"bedName"}
    Loading={bedTypeLoading}
    ListLoading={ListLoading}
    get={getBedTypeData}
    add={createBedType}
    update={updateBedType}
    tableData={bedTypeData}
    paginationModel={paginationModel}
    setPaginationModal={ (data) => dispatch(setBedTypePagination(data))}
    editData={editBedTypeData}
    setEditData={(data)=>dispatch(setBedTypeEditData(data))}
    FieldHeaderName={"Bed Type"}
    tableDataCount={bedTypeCount}
    />

  )
}

export default BedTypeMaster