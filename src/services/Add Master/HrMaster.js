import { useEffect, useState } from "react";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { setDepartmentCount, setDepartmentCountIncByOne, setDepartmentData, setDepartmentLoading, setDesignationCount, setDesignationCountIncByOne, setDesignationData, setDesignationLoading, setSpecialityData, setSpecialityLoading, setSpeciallityCount, setSpeciallityCountIncByOne } from "../../slices/hr.slice";
import toast from "react-hot-toast";
import { setServiceEmptyData } from "../../slices/service.slice";

const ApiManager = new APIManager();

export const useHrMasterData = () => {
    const [Loding, setLoding] = useState(false);
    const dispatch = useDispatch();
    const { departmentData,departmentPagination,designationData,designationPagination,specialityData,specialityPagination } = useSelector(state => state.hr);

    const getDepartmentData = async (withLoading = false,page=departmentPagination.page,pageSize=departmentPagination.pageSize) => {
        try {
                if(withLoading)
            {
                dispatch(setDepartmentLoading(true));
            }

            const resData = await ApiManager.get(`admin/addMaster/getdepartment?page=${page}&pageSize=${pageSize}`);

            if(!resData.error)
            {
                dispatch(setDepartmentData(resData.data.data));
                dispatch(setDepartmentCount(resData.data.count));
                withLoading && dispatch(setDepartmentLoading(false));
                return true;
            }
            if(withLoading)        
            {
                dispatch(setDepartmentLoading(false));
            }
        return true;
        } catch (error) {
            // toast.error(error?.message || "Something went wrong");
            return false;   
        }
    }

    const addDepartmentData = async (data,resetAll) => {
        const toastId = toast.loading("Loading...");
        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createdepartment",data);

        if(!resData.error)
        {
            resetAll();
            const { page,pageSize } = departmentPagination;
            if(Number.isNaN(departmentData?.length) || page*pageSize+pageSize > departmentData?.length) {
                getDepartmentData();
            } else { 
                dispatch(setDepartmentCountIncByOne())
            }
            setLoding(false);
            toast.dismiss(toastId);
            toast.success("Department Added Successfully");
            return true;
        }
        toast.dismiss(toastId);
        setLoding(false);
        return false;
    }

    const updateDepartmentData = async (data,resetAll) => {
        const toastId = toast.loading("Loading...");
        setLoding(true);
        try {
            const resData = await ApiManager.patch(`admin/addMaster/updatedepartment`,{departmentId:data?._id,...data});

            if(!resData?.error)
            {
                resetAll();
                const tempData = structuredClone(departmentData);
                tempData[data?.id] = resData?.data?.data;
                dispatch(setDepartmentData(tempData));
                dispatch(setServiceEmptyData());
                toast.dismiss(toastId);
                setLoding(false);
                toast.success("Department Updated Successfully");
                return true;
            }
            setLoding(false);
            toast.dismiss(toastId);
            return false;
        } catch (error) {
            // toast.error(error?.message || "Something went wrong");
            return false;
        }
    }

    const getDesignationData = async (withLoading=false,page=designationPagination.page,pageSize=designationPagination.pageSize) => {
        if(withLoading)
        {
            dispatch(setDesignationLoading(true));
        }

        const resData = await ApiManager.get(`admin/addMaster/getdesignation?page=${page}&pageSize=${pageSize}`);
        
        if(!resData.error)
        {
            dispatch(setDesignationData(resData?.data?.data));
            dispatch(setDesignationCount(resData?.data?.count)); 
            withLoading && dispatch(setDesignationLoading(false));
            return true;
        }

        if(withLoading)
        {
            dispatch(setDesignationLoading(false));
        }
        return false;
    }

    const createDesignation = async (data,resetAll) => { 
        const toastId = toast.loading("Loading...");
        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createdesignation",data);

        if(!resData.error)
        {
            resetAll();
            const { page,pageSize } = designationPagination;
            if(Number.isNaN(designationData?.length) || page*pageSize+pageSize > designationData?.length) {
                getDesignationData();
            } else { 
                dispatch(setDesignationCountIncByOne())
            }
            setLoding(false);
            toast.dismiss(toastId);
            toast.success("Designation Added Successfully");
            return true;
        }
        toast.dismiss(toastId);
        setLoding(false);
        return false;
    }

    const updateDesignation = async (data,resetAll) => {
        setLoding(true);
        const toastId = toast.loading("Loading...");
        const resData = await ApiManager.patch(`admin/addMaster/updatedesignation`,{designationId:data?._id,...data});

        if(!resData.error)
        {
            resetAll();
            const tempData = structuredClone(designationData);
            tempData[data?.id] = resData?.data?.data;
            dispatch(setDesignationData(tempData));
            setLoding(false);
            toast.dismiss(toastId);
            toast.success("Designation Updated Successfully");
            return true;
        }
        toast.dismiss(toastId);
        setLoding(false);
        return false;
    }   

    const getSpecilityData = async (withLoading=false,page=specialityPagination.page,pageSize=specialityPagination.pageSize) => {

        if(withLoading)
        {
            dispatch(setSpecialityLoading(true));
        }

        const resData = await ApiManager.get(`admin/addMaster/getspeciality?page=${page}&pageSize=${pageSize}`);
        
        if(!resData.error)
        {
            dispatch(setSpecialityData(resData?.data?.data));           
            dispatch(setSpeciallityCount(resData?.data?.count));
            withLoading && dispatch(setSpecialityLoading(false));
            return true; 
        }

        if(withLoading)
        {
            dispatch(setSpecialityLoading(false));
        }
        return false;
    }

    const updateSpecility = async (data,resetAll) => {
        const toastId = toast.loading("Loading...");
        setLoding(true);

        const resData = await ApiManager.patch(`admin/addMaster/updatespeciality`,{specialityId:data?._id,...data});

        if(!resData.error)
        {
            resetAll();
            const tempData = structuredClone(specialityData);
            tempData[data?.id] = resData?.data?.data;
            dispatch(setSpecialityData(tempData));
            setLoding(false);
            toast.dismiss(toastId);
            toast.success("Speciality Updated Successfully");
            return true;
        }
        toast.dismiss(toastId);
        setLoding(false);
        return false;
    }

    const createSpecility = async (data,resetAll) => {
        const toastId = toast.loading("Loading...");
        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createspeciality",data);
        const { page,pageSize } = specialityPagination;
        if(!resData.error)
        {
            resetAll();
            if(Number.isNaN(specialityData?.length) || page*pageSize+pageSize > specialityData?.length) {
                getSpecilityData();
            } else { 
                dispatch(setSpeciallityCountIncByOne())
            }
            toast.dismiss(toastId);
            setLoding(false);
            toast.success("Speciality Added Successfully");
            return true;
        }   
        toast.dismiss(toastId);
        setLoding(false);
        // toast.error(resData?.message);
        return false;
    }

    useEffect(()=>{
    if(!departmentData)
        getDepartmentData(true);
    if(!designationData)
        getDesignationData(true);
    if(!specialityData)
        getSpecilityData(true);
    },[])

    return {
        Loding,
        getDepartmentData,
        addDepartmentData,
        updateDepartmentData,
        createDesignation,
        updateDesignation,
        getDesignationData,
        createSpecility,
        updateSpecility,
        getSpecilityData
    };
}