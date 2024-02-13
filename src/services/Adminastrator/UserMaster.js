import toast from "react-hot-toast";
import APIManager from "../../utils/ApiManager";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserCount, setUserCountIncByOne, setUserData, setUserListLoading, setUserLoading } from "../../slices/user.slice";
import { setRegistrationEmptyData } from "../../slices/registration.slice";

const ApiManager = new APIManager();


export const useUserData = () => {
    const dispatch = useDispatch();
    const { userLoading : Loading,userData:UserData,userCount,userPaginaiton:paginationModel } = useSelector(state => state.user);

    const getUserData = async (withLoading=false,page=0,pageSize=10) => {
        if(withLoading)
        {
            dispatch(setUserListLoading(true));
            console.timeEnd('end');
        }
        const data = await ApiManager.get(`admin/userMaster/getuser?page=${page}&pageSize=${pageSize}`);
        if(!data.error)
        {
            dispatch(setUserData(data.data.data));   
            dispatch(setUserCount(data.data.count));
            withLoading && dispatch(setUserListLoading(false));
            return true;
        }
        if(withLoading)
        {
            dispatch(setUserListLoading(false));
        }
        return false;
    }

    const getUserFindById = async (id) => {
        const toastId = toast.loading("Loading...");
        dispatch(setUserLoading(true))
        const data = await ApiManager.get(`admin/userMaster/getuser/${id}`);
        if(!data.error)
        {
            toast.dismiss(toastId);
            dispatch(setUserLoading(false))
            return data.data.data;
        }
        toast.dismiss(toastId);
        dispatch(setUserLoading(false))
        return false;
    }

    const updateUSer = async (data,page,pageSize,image) => {
        dispatch(setUserLoading(true));
        const tosatId = toast.loading("Loading...");
        if(image)
        {   data = {...data,image:image}
            const formData = new FormData();
            for(let i of Object.keys(data))
            {
                formData.append(i,data[i]);   
            }

            try {
                const resData = await ApiManager.patchForm(`admin/userMaster/updateuser/${data._id}?image=true`,formData);
                if(!resData.error)
                {
                    const tempData = structuredClone(UserData);
                    tempData[data?.id] = resData.data.data;
                    dispatch(setUserData(tempData));
                    toast.success(resData?.message);
                    dispatch(setUserLoading(false));
                    dispatch(setRegistrationEmptyData(null));
                    toast.dismiss(tosatId);
                    return true;
                }
                dispatch(setUserLoading(false));
                toast.dismiss(tosatId);
                return false;

                } catch (error) {
                    dispatch(setUserLoading(false));
                    toast.dismiss(tosatId);
                    return false;
                }            
            
            
        }
        else {
            const resData = await ApiManager.patch(`admin/userMaster/updateuser/${data._id}`,data);

            if(!resData.error)
            {
                const tempData = structuredClone(UserData);
                tempData[data?.id] = resData.data.data;
                dispatch(setUserData(tempData));
                dispatch(setUserLoading(false));
                toast.dismiss(tosatId);
                toast.success("user updated successfully");
                return true;
            }
            toast.dismiss(tosatId);
            dispatch(setUserLoading(false));
            return false;
        }
       

    }

    const addUser = async (data,page,pageSize) => {
        dispatch(setUserLoading(true));
        const tosatId = toast.loading("Loading...");
        const formData = new FormData();
        for(let i of Object.keys(data))
        {
            formData.append(i,data[i]);   
        }
        try
        {
            const resData = await ApiManager.postForm(`admin/userMaster/adduser`,formData);
            if(!resData.error)
            {
                if(Number.isNaN(UserData?.length) || page*pageSize+pageSize > UserData?.length) {
                    getUserData(false,page,pageSize);
                } else { 
                    dispatch(setUserCountIncByOne())
                }
                toast.success("user added successfully");
                toast.dismiss(tosatId);
                dispatch(setUserLoading(false));
                return true;
            }
            toast.dismiss(tosatId);
            dispatch(setUserLoading(false));
            return false;
        }
        catch(e)
            {
                toast.dismiss(tosatId);
                dispatch(setUserLoading(false));
                return false;
            }
    }

    const assignRoleToUser = async (data) => {
        dispatch(setUserLoading(true));
        const toastId = toast.loading("Loading...");
        let userData = UserData[data?.userId-1];
        console.log("this is real problem : ",userData,data,UserData);
        const resData = await ApiManager.post(`admin/roleMaster/assignrole/roleId/${data?.roleId}/userId/${userData._id}`,{value:data?.value});
        console.log("this is res data",resData.data);
        if(!resData.error)
        {
            let temp = structuredClone(UserData);
            temp[data?.userId-1] = resData.data.data;
            dispatch(setUserData(temp));
            dispatch(setUserLoading(false));
            toast.success(resData.message);
            toast.dismiss(toastId);
            return true;
        }
        toast.dismiss(toastId);
        return false;
    }

    useEffect(()=>{
        if(!UserData)
        {
            getUserData(true,0,10);
        }
    },[]);

    return {
        getUserData,
        getUserFindById,
        updateUSer,
        addUser,
        Loading,
        assignRoleToUser,
        userCount,
        paginationModel,
    }
}

