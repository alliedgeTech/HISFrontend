import { useEffect, useState } from "react";
import APIManager from "../../utils/ApiManager";


const ApiManager = new APIManager();

export const useSiderbarData = () => {

    const [SidebarData, setSidebarData] = useState(null);
    const [Loading, setLoading] = useState(true);

    const getSidebarData = async () =>  {
        setLoading(true);
        const data = await ApiManager.get("admin/module");
        if(!data?.error) {
            setSidebarData(data.data.data);
        }
        setLoading(false);
    }

    useEffect(()=>{
        getSidebarData();
    },[])

    return {
        SidebarData,
        Loading,
    }

}