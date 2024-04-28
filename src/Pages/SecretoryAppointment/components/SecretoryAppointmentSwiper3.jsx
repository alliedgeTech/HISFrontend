import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import EmptyData from '../../../Components/NoData/EmptyData';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import { LinearProgress } from '@mui/material';
import TableMainBox from '../../../Components/TableMainBox/TableMainBox';
import TableClasses from '../../../Components/TableMainBox/TableMainBox.module.css'
import socket from '../../../socket';
import { setSecretoryAppointmentOutTimeData, setSecretoryNewAppointmentOutTimeData } from '../../../slices/secretoryAppointment.slice';

function CustomHeader() {
    return (
        <div className={TableClasses["tableMainHeader-container"]}>
            <div style={{color:"#25396f"}} className={TableClasses["tableMainHeader-text"]}>{"Compeleted Appointment"}</div>
        </div>
    )
}

function SecretoryAppointmentSwiper3() {
    const  { doctorAppointmentList,appointmentOutTimeData,branch } = useSelector((state) => state.secretoryAppointment);
    const dispatch = useDispatch();
    function GetTodayDate () {  
        return new Date().toLocaleDateString("en-CA").toString();
    }

    const [Loading, setLoading] = useState(true);

  useEffect(() => {

   let key = "_"+GetTodayDate()+"_"+branch?._id+"_appointmentOutTime";

   if(doctorAppointmentList?._id) key = doctorAppointmentList?._id+"_"+GetTodayDate()+"_"+branch._id+"_appointmentOutTime";

    socket.emit("joinRoom", [key]);

    socket.emit("appointmentOutTime",{ key, type:'get' },(data) => {
        dispatch(setSecretoryAppointmentOutTimeData(data));
        setLoading(false);
    });

    socket.on("appointmentOutTime",(data) => {
      switch (data.type) {
        case "add":
          dispatch(setSecretoryNewAppointmentOutTimeData(data.data));
          break;
      
        default:
          break;
      }
    })   
   
    return () => {
      socket.off("appointmentOutTime");
      socket.emit("leaveRoom", key);
    };
  }, []);

  const columns = [
    {
      field: "_id",
      headerName: "_id",
      width: 0,
    },
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "pationName",
      headerName: "Pation Name",
      flex: 1,
    },
    {
      field: "mobileNo",
      headerName: "Mobile No",
      width: 180,
    },
    {
      field:"email",
      headerName:"Email",
      width:250,
      flex:1
    },
    {
      field: "appointmentType",
      headerName: "Appointment Type",
      width: 120,
      flex:1,
    },
    {
      field:"startTime",
      headerName:"SlotTime",
      flex:1,
      width:130
    },
    {
      field: "visitType",
      headerName: "Visit Type",
      flex: 1,
    },
    {
      field:"jwt",
      headerName:"JWT",
      width:120,
    },
    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      renderCell: (params) => (
        <div>{params?.row?.appointmentDate?.slice(0, 10)}</div>
      ),
      width: 250,
    },
    {
      field:"inTime",
      headerName:"InTime",
      renderCell:(params) => (
        <div>{params.row.inTime ? params.row.inTime : "-" }</div>
      )
    },
    {
      field:"outTime",
      headerName:"OutTime",
      renderCell:(params) => (
        <div>{params.row.outTime ? params.row.outTime : "-" }</div>
      )
    },
  ];

  const setRows = (data) => {
    let id = 0;
    let array = [];
    data?.forEach((element) => {
      let thisData = {
        _id: element?._id,
        id: ++id,
        pationName: element?.registration?.pationName,
        appointmentType: element?.appointmentType,
        appointmentDate: element?.appointmentDate?.slice(0, 10),
        visitType: element?.visitType,
        email:element?.registration?.email,
        mobileNo: element?.registration?.mobileNo,
        jwt:element?.jwt,
        startTime: element?.time?.startTime || element?.currentTime,
        inTime:element?.inTime,
        outTime:element?.outTime
      };
      array.push(thisData);
    });
    return array;
  }

  const rowData = useMemo(()=>{
    if( appointmentOutTimeData  && Array.isArray(appointmentOutTimeData) && !Loading){
       return setRows(appointmentOutTimeData);                                 
    }
  },[appointmentOutTimeData,Loading]);
    
  return (
    <>
        <TableMainBox
        customHeader={<CustomHeader />}
        >
        {
            Loading ? <><LinearProgress />
            <TableSkeleton /></> 
            : Array.isArray(rowData) && rowData?.length > 0 ?  
            <DataGrid
            style={{ maxHeight: `calc(100vh - 173px)` }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  _id: false,
                },
              },
            }}
            sx={{
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "15px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "22px",
              },
            }}
            disableRowSelectionOnClick={true}
            columns={columns}
            rows={rowData}
            slots={{ toolbar: GridToolbar }}
            getRowHeight={(_data) => "auto"}
            classes={{ cellContent: "cellContent" }}
          />  : <EmptyData />
        }
        </TableMainBox>
       
       
    </>
  )
}

export default SecretoryAppointmentSwiper3


