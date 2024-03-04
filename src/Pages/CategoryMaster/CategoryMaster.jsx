import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useCategoryMaster } from '../../services/Add Master/CategoryMaster';
import { setCategoryEditData, setCategoryPagination } from '../../slices/category.slice';
import CommonMaster from '../CommonMaster/CommonMaster';

function CategoryMaster() {

      const { categoryData,categoryEditData,actionLoading,categoryCount,categoryPagination:paginationModel,categoryListLoading:listLoading } = useSelector(state => state.category);

      const dispatch = useDispatch();

      const { createCategoryData,updateCategoryData,getCategoryData } = useCategoryMaster();

      
  return (
    <>
        <CommonMaster 
        key={"category"}
        MainValue={"categoryName"}
        Loading={actionLoading}
        ListLoading={listLoading}
        get={getCategoryData}
        add={createCategoryData}
        update={updateCategoryData}
        tableData={categoryData}
        paginationModel={paginationModel}
        setPaginationModal={ (data) => dispatch(setCategoryPagination(data))}
        editData={categoryEditData}
        setEditData={(data)=>dispatch(setCategoryEditData(data))}
        FieldHeaderName={"Category"}
        tableDataCount={categoryCount}
        />
        
    </>
  )
}

export default CategoryMaster