import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useTarrifData } from '../../services/Add Master/TarrifMaster';
import CommonMaster from '../CommonMaster/CommonMaster';
import { setTarrifEditData, setTarrifPagination } from '../../slices/tarrif.slice';

function TarrifMaster() {
    const  { createTarrifData,getTarrifData,updateTarrifData } = useTarrifData();
    const {tarrifData,tarrifPagination:paginationModel,tarrifCount,tarrifLoading,editTarrifData,tarrifListLoading:listLoading} = useSelector(state => state.tarrif);
    const dispatch = useDispatch();

  return (
    <CommonMaster 
        key={"tarrif"}
        MainValue={"tariffName"}
        Loading={tarrifLoading}
        ListLoading={listLoading}
        get={getTarrifData}
        add={createTarrifData}
        update={updateTarrifData}
        tableData={tarrifData}
        paginationModel={paginationModel}
        setPaginationModal={(data)=>console.log("data that is data",data)}
        editData={editTarrifData}
        setEditData={(data) => dispatch(setTarrifEditData(data))}
        FieldHeaderName={"Tarrif"}
        tableDataCount={tarrifCount}
    />
  )
}

export default TarrifMaster