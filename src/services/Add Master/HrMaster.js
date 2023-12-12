import { useEffect, useState } from "react";
import APIManager from "../../utils/ApiManager";
import { useDispatch, useSelector } from "react-redux";
import { setDepartmentData, setDepartmentLoading, setDesignationData, setDesignationLoading, setSpecialityData, setSpecialityLoading } from "../../slices/hr.slice";
import { toast } from "react-toastify";
// import toast from "react-hot-toast";

const ApiManager = new APIManager();

export const useHrMasterData = () => {
    const [Loding, setLoding] = useState(false);
    const dispatch = useDispatch();
    const { departmentData , designationData , specialityData } = useSelector(state => state.hr);

    const getDepartmentData = async (withLoading = false) => {
        if(withLoading)
        {
            dispatch(setDepartmentLoading(true));
        }

        const resData = await ApiManager.get("admin/addMaster/getdepartment");

        if(!resData.error)
        {
            dispatch(setDepartmentData(resData.data));
        }
        if(withLoading)        
        {
            dispatch(setDepartmentLoading(false));
        }
    }

    const addDepartmentData = async (data) => {

        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createdepartment",{department:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getDepartmentData();
            setLoding(false);
            toast.success("Department Added Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
        return false;
    }

    const updateDepartmentData = async (data) => {
        setLoding(true);
        const resData = await ApiManager.patch(`admin/addMaster/updatedepartment`,{departmentId:data?._id,department:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getDepartmentData();
            setLoding(false);
            toast.success("Department Updated Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
        return false;
    }

    const getDesignationData = async (withLoading=false) => {
        if(withLoading)
        {
            dispatch(setDesignationLoading(true));
        }

        const resData = await ApiManager.get("admin/addMaster/getdesignation");
        
        if(!resData.error)
        {
            dispatch(setDesignationData(resData?.data));            
        }

        if(withLoading)
        {
            dispatch(setDesignationLoading(false));
        
        }
    }

    const createDesignation = async (data) => {
        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createdesignation",{designation:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getDesignationData();
            setLoding(false);
            toast.success("Designation Added Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
        return false;
    }

    const updateDesignation = async (data) => {
        setLoding(true);
        const resData = await ApiManager.patch(`admin/addMaster/updatedesignation`,{designationId:data?._id,designation:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getDesignationData();
            setLoding(false);
            toast.success("Designation Updated Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
        return false;
    }   

    const getSpecilityData = async (withLoading=false) => {
        if(withLoading)
        {
            dispatch(setSpecialityLoading(true));
        }

        const resData = await ApiManager.get("admin/addMaster/getspeciality");
        
        if(!resData.error)
        {
            dispatch(setSpecialityData(resData?.data));            
        }

        if(withLoading)
        {
            dispatch(setSpecialityLoading(false));
        
        }
    }

    const updateSpecility = async (data) => {
        setLoding(true);
        const resData = await ApiManager.patch(`admin/addMaster/updatespeciality`,{specialityId:data?._id,speciality:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getSpecilityData();
            setLoding(false);
            toast.success("Speciality Updated Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
        return false;
    }

    const createSpecility = async (data) => {

        setLoding(true);
        const resData = await ApiManager.post("admin/addMaster/createspeciality",{speciality:data?.value,isActive:data?.isActive});

        if(!resData.error)
        {
            getSpecilityData();
            setLoding(false);
            toast.success("Speciality Added Successfully");
            return true;
        }
        setLoding(false);
        toast.error(resData?.message);
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
        addDepartmentData,
        updateDepartmentData,
        createDesignation,
        updateDesignation,
        createSpecility,
        updateSpecility,
    };
}