import { useEffect } from "react"
import { useSelector,useDispatch } from 'react-redux';
import APIManager from "../../utils/ApiManager";
import { setActionLoading, setCategoryCount, setCategoryCountIncByOne, setCategoryData, setListLoading } from "../../slices/category.slice";
import toast from "react-hot-toast";

const ApiManaget = new APIManager();

export const useCategoryMaster = () => {

    const { categoryData,categoryPagination } = useSelector(state => state.category);
    const dispatch = useDispatch();
    
    const getCategoryData = async(withLoading=false,page,pageSize) => {
        if(withLoading)
        {
            dispatch(setListLoading(true));
        
        }
        const resData = await ApiManaget.get(`admin/addMaster/category?page=${page}&pageSize=${pageSize}`);

        if(!resData?.error)
        {
            dispatch(setCategoryData(resData?.data?.data));
            dispatch(setCategoryCount(resData?.data?.count));
            withLoading && dispatch(setListLoading(false));
            return true;
        }

        if(withLoading)
        {
            dispatch(setListLoading(false));
        }
        return false;
    }

    const createCategoryData = async(data,resetAll) => {
        dispatch(setActionLoading(true));

        const resData = await ApiManaget.post("admin/addMaster/category",data);

        if(!resData?.error)
        {
            resetAll();
            toast.success("Category Created Successfully");
            let { page,pageSize } = categoryPagination;
            if(Number.isNaN(categoryData?.length) || page*pageSize+pageSize > categoryData?.length) {
                getCategoryData(false,page,pageSize);
            } else { 
                dispatch(setCategoryCountIncByOne())
            }
            dispatch(setActionLoading(false));
            return true;
        }

        dispatch(setActionLoading(false));
        return false;
    }

    const updateCategoryData = async(data,resetAll) => {
        dispatch(setActionLoading(true));

        const resData = await ApiManaget.patch(`admin/addMaster/category`,{...data,categoryId:data._id});

        if(!resData?.error)
        {
            const temp = structuredClone(categoryData);
            temp[data.id] = resData.data.data;
            dispatch(setCategoryData(temp)); 
            resetAll();
            toast.success("Category Updated Successfully");
            dispatch(setActionLoading(false));
            return true;
        }

        dispatch(setActionLoading(false));
        return false;
    }



    useEffect(()=>{
        if(!categoryData)
        {
            getCategoryData(true,0,10);
        }
    },[]);

    return {
        createCategoryData,
        updateCategoryData,
        getCategoryData
    }
}