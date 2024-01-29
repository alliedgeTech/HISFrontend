import React from 'react'
import CommonMaster from '../CommonMaster/CommonMaster'
import { useUserTitleMasterData } from '../../services/Add Master/UserTitleMaster';
import { setUserTitleEditData, setUserTitlePagination } from '../../slices/userTitle.slice';
import { useDispatch,useSelector } from 'react-redux';

function UserTitleMaster() {
    const { listLoading,createUserTitleData,getUserTitleData,updateUserTitleData } = useUserTitleMasterData();
    const  { userTitleData,userTitleLoading,editUserTitleData,userTitleCount,userTitlePaginaiton } = useSelector(state => state.userTitle);
    const dispatch = useDispatch();

  return (
    <CommonMaster 
    key={"userTitle"}
    MainValue={"userTitle"}
    Loading={userTitleLoading}
    ListLoading={listLoading}
    get={getUserTitleData}
    add={createUserTitleData}
    update={updateUserTitleData}
    tableData={userTitleData}
    paginationModel={userTitlePaginaiton}
    setPaginationModal={ (data) => dispatch(setUserTitlePagination(data))}
    editData={editUserTitleData}
    setEditData={(data) => dispatch(setUserTitleEditData(data)) }
    FieldHeaderName={"User Title"}
    tableDataCount={userTitleCount}
    />
  )
}

export default UserTitleMaster