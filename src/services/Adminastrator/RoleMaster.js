import toast from "react-hot-toast";
import APIManager from "../../utils/ApiManager";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRoleCount, setRoleData, setRoleLoading } from "../../slices/role.slice";

const ApiManager = new APIManager();


export const useRoleData = () => {
    const [ListLoading, setListLoading] = useState(false);

    const dispatch = useDispatch();
    const {roleLoading:Loading,roleData} = useSelector(state => state.role); 
    const getRoleData = async (withLoading=false,page=0,pageSize=10) => {

        if(withLoading)
        {
            setListLoading(true);
        }
        const data = await ApiManager.get(`admin/RoleMaster/getrole?page=${page}&pageSize=${pageSize}`);
        if(!data.error)
        {
            dispatch(setRoleCount(data?.data?.count))
            dispatch(setRoleData(data?.data?.data));
            withLoading && setListLoading(false);
            return true;
        }
        if(withLoading)
        {
            setListLoading(false);
        }
        return false;
    }

    const updateRole = async (data,page,pageSize) => {
        dispatch(setRoleLoading(true));
        const resData = await ApiManager.put(`admin/RoleMaster/updaterole/${data._id}`,data);
        
        if(!resData.error)
        {
            let temp = structuredClone(roleData);
            temp[(data?.id - (page*pageSize)) - 1 ] = {...resData.data.data};
            dispatch(setRoleData(temp));
            toast.success(resData.message);
            dispatch(setRoleLoading(false));
            return true;
        }

        dispatch(setRoleLoading(false));
        return false;
    }


    const addRole = async (data,page,pageSize) => {
        // setLoading(true);
        dispatch(setRoleLoading(true));
        const resData = await ApiManager.post("admin/RoleMaster/addrole",data);

        if(!resData.error)
        {
            getRoleData(false,page,pageSize);
            toast.success(resData.message);
            // setLoading(false);
            dispatch(setRoleLoading(false))
            return true;
        }
        // setLoading(false);
        dispatch(setRoleLoading(false));
        return false;
    }


    useEffect(()=>{
    if(!roleData)
        getRoleData(true);
    },[]);

    return {
        updateRole,
        addRole,
        Loading,
        ListLoading,
        getRoleData
    }
}

