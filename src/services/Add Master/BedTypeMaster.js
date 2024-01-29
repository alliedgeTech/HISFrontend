import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBedTypeCount, setBedTypeCountIncByOne, setBedTypeData, setBedTypeLoading } from "../../slices/bedtype.slice";
import APIManager from "../../utils/ApiManager";
import toast from 'react-hot-toast'
const ApiManager = new APIManager();

export const useBedType = () => {
  const [ListLoading, setListLoading] = useState(false);
  const dispatch = useDispatch();
  const { bedTypeData, bedTypePagination: paginationModel } = useSelector(
    (state) => state.bedType
  );

  const getBedTypeData = async (
    withLoading = false,
    page = paginationModel.page,
    pageSize = paginationModel.pageSize
  ) => {
    if (withLoading) {
      setListLoading(true);
    }
    const data = await ApiManager.get(
      `admin/addMaster/bedtype?page=${page}&pageSize=${pageSize}`
    );
    if (!data.error) {
      dispatch(setBedTypeCount(data?.data?.count));
      dispatch(setBedTypeData(data?.data?.data));
      withLoading && setListLoading(false);
      return true;
    }
    if (withLoading) {
      setListLoading(false);
    }
    return false;
  };

  const createBedType = async (data,resetAll) => {
    const toastId = toast.loading("Loading...");
    dispatch(setBedTypeLoading(true));
    const resData = await ApiManager.post("admin/addMaster/bedtype",data);

    if(!resData.error)
    {
        const { page,pageSize } = paginationModel;
        if(Number.isNaN(bedTypeData?.length) || page*pageSize+pageSize > bedTypeData?.length) {
            getBedTypeData(false,page,pageSize);
        } else { 
            dispatch(setBedTypeCountIncByOne());
        }
        resetAll();
        toast.success(resData.message);
        dispatch(setBedTypeLoading(false));
        toast.dismiss(toastId);
        return true;
    }
    dispatch(setBedTypeLoading(false));
    toast.dismiss(toastId);
    return false;
  }

  const updateBedType = async (data,resetAll) => {
    console.log("come here",data);
    dispatch(setBedTypeLoading(true));
    const toastId = toast.loading("Updating...");
    const resData = await ApiManager.patch(`admin/addMaster/bedtype/${data._id}`,data);
        
    if(!resData.error)
    {
        resetAll();
        const temp = structuredClone(bedTypeData); 
        temp[data?.id] = resData.data.data;
        dispatch(setBedTypeData(temp));
        toast.success(resData.message);
        dispatch(setBedTypeLoading(false));
        toast.dismiss(toastId);
        return true;
    }
    
    toast.dismiss(toastId);
    dispatch(setBedTypeLoading(false));
    return false;
  }

  useEffect(() => {
    !bedTypeData && getBedTypeData(true);
  },[])

  return {
    ListLoading,
    getBedTypeData,
    createBedType,
    updateBedType
  };
};
