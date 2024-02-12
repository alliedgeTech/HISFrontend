import APIManager from "../../utils/ApiManager";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setBedTypeData, setSocCount, setSocCountIncByOne, setSocData, setSocLoading } from "../../slices/soc.slice";
import toast from 'react-hot-toast';

const ApiManager = new APIManager();

export const useSocMasterData = () => {
    const { socData,socPagination:paginationModal } = useSelector(state => state.soc)   
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function getSocMasterData(withLoading=false,page=paginationModal.page,pageSize=paginationModal.pageSize) {
        withLoading && setLoading(true);

        const promiseResData = ApiManager.get(`admin/billing/soc?page=${page}&pageSize=${pageSize}`);
        const promiseBedTypeData = ApiManager.get("admin/addMaster/bedtype");

        const temp =await Promise.all([promiseResData,promiseBedTypeData]);

        if(!Array.isArray(temp)) return; 

        const [ resData, bedTypeData ] = temp;  

        console.log({temp})

        if(!bedTypeData.error){
            dispatch(setBedTypeData(bedTypeData.data.data));
        }

        if(!resData.error){
            dispatch(setSocData(resData.data.data));
            dispatch(setSocCount(resData.data.count));
            withLoading && setLoading(false);
            return true;
        }

        withLoading && setLoading(false);
        return false;
    }

    async function createSocMaster(data)  {
        const toastId = toast.loading("Loading...");
        dispatch(setSocLoading(true));

        const resData = await ApiManager.post("soc",data);

        if(!resData.error){
            const { page,pageSize } = paginationModal;

            if(Number.isNaN(socData?.length) || page*pageSize+pageSize > socData?.length) {
                getSocMasterData(false,page,pageSize);
            } else {
                dispatch(setSocCountIncByOne());
            }

            toast.dismiss(toastId);
            toast.success(resData.message);
            dispatch(setSocLoading(false))
            return true;
        }

        toast.dismiss(toastId);
        dispatch(setSocLoading(false))
        return false;
    }

    async function updateSocMaster(data) {
        const toastId = toast.loading("Loading...");
        dispatch(setSocLoading(true));

        const resData = await ApiManager.patch(`soc/${data._id}`,data);

        if(!resData.error){
            const tempData = structuredClone(socData);
            tempData[data.id] = resData.data.data;
            dispatch(setSocData(tempData));
            toast.dismiss(toastId);
            toast.success(resData.message);
            dispatch(setSocLoading(false));
            return true;
        }

        toast.dismiss(toastId);
        dispatch(setSocLoading(false));
        return false;
    };


    useEffect(() => {
        !socData && getSocMasterData(true); 
    },[]);

    return {
        listLoading:loading,
        getSocMasterData,
        createSocMaster,
        updateSocMaster
    }
}

