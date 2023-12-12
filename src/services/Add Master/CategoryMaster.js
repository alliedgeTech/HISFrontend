import { useEffect } from "react"
import { useSelector,useDispatch } from 'react-redux';
import APIManager from "../../utils/ApiManager";
import { setActionLoading, setCategoryData, setListLoading } from "../../slices/category.slice";
import toast from "react-hot-toast";

const ApiManaget = new APIManager();

export const useCategoryMaster = () => {

    const { categoryData } = useSelector(state => state.category);
    const dispatch = useDispatch();
    
    const getCategoryData = async(withLoading=false) => {
        if(withLoading)
        {
            dispatch(setListLoading(true));
        
        }
        const resData = await ApiManaget.get("admin/addMaster/category");

        if(!resData?.error)
        {
            dispatch(setCategoryData(resData?.data));
        }

        if(withLoading)
        {
            dispatch(setListLoading(false));
        }
    }

    const createCategoryData = async(data) => {
        dispatch(setActionLoading(true));

        const resData = await ApiManaget.post("admin/addMaster/category",data);

        if(!resData?.error)
        {
            toast.success("Category Created Successfully");
            getCategoryData();
            dispatch(setActionLoading(false));
            return true;
        }

        dispatch(setActionLoading(false));
        toast.error(resData?.message);
        return false;
    }

    const updateCategoryData = async(data) => {
        dispatch(setActionLoading(true));

        const resData = await ApiManaget.patch(`admin/addMaster/category`,data);

        if(!resData?.error)
        {
            toast.success("Category Updated Successfully");
            getCategoryData();
            dispatch(setActionLoading(false));
            return true;
        }

        dispatch(setActionLoading(false));
        toast.error(resData?.message);
        return false;
    }



    useEffect(()=>{
        if(!categoryData)
        {
            getCategoryData(true);
        }
    },[]);

    return {
        createCategoryData,
        updateCategoryData
    }
}