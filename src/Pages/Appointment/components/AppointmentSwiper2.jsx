import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { socket } from '../../../socket';
import EmptyData from '../../../Components/NoData/EmptyData';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { setAppointmentJwtData } from '../../../slices/appointment.slice';
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import { LinearProgress } from '@mui/material';
import TableClasses from '../../../Components/TableMainBox/TableMainBox.module.css'
import TableMainBox from '../../../Components/TableMainBox/TableMainBox';

function AppointmentSwiper2() {
    const  { doctorAppointmentList,appointmentJwtData } = useSelector((state) => state.appointment);
    const dispatch = useDispatch();

    function GetTodayDate () {  
        return new Date().toLocaleDateString("en-CA").toString();
    }

    function GetHourAndMin(){
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      return `${hours}:${minutes}`;

    }

    function CustomHeader() {
      return (
          <div className={TableClasses["tableMainHeader-container"]}>
              <div style={{color:"#25396f"}} className={TableClasses["tableMainHeader-text"]}>{"OnGoing Appointment"}</div>
          </div>
      )
  }
  

    const [Loading, setLoading] = useState(true);

  useEffect(() => {
    function onConnect() {
      console.log("socket is connected");
      socket.emit("joinRoom", [GetTodayDate()+doctorAppointmentList?._id+"_jwt"], "appointment_jwt");
    }

    socket.on("appointment_jwt", (data) => {
        console.log("appointment_jwt", data);
        dispatch(setAppointmentJwtData(data));
        setLoading(false);
    });
    
    function onDisconnect() {
      console.log("socket disconnedted");
    }

    function connect() {
      console.log("this function run ");
      socket.connect();
    }

    function disconnect() {
      socket.disconnect();
    }

    connect();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
   

   
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.emit("leaveRoom", GetTodayDate()+doctorAppointmentList?._id+"_jwt");
      disconnect();
      console.log("component is unmounted");
    };
  }, []);

  function emitInTimeEvent(_id){
      let tempData = {
        _id,
        userId:doctorAppointmentList?._id,
        inTime:GetHourAndMin(),
        date:GetTodayDate(),
      }

      socket.emit("appointment_inTime",tempData);
      console.log("this is in time we have to send : ",tempData);
  }

  function emitOutTimeEvent(_id)
  {
    let tempData = {
      _id,
      userId:doctorAppointmentList?._id,
      outTime:GetHourAndMin(),
      date:GetTodayDate(),
    }
    socket.emit("appointment_outTime",tempData);
  }

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
      header:"SlotTime",
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
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <>
          <div
            onClick={() => { emitInTimeEvent(params?.row?._id) }}>
            In Time
          </div>
          <div 
            onClick={()=>{emitOutTimeEvent(params?.row?._id)}}
          >
            Out Time
          </div>

        </>
      ),
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
        startTime:element?.time?.startTime,
        inTime:element?.inTime,
        outTime:element?.outTime
      };
      array.push(thisData);
    });
    return array;
  }

  const rowData = useMemo(()=>{
    if( appointmentJwtData  && Array.isArray(appointmentJwtData) && !Loading){
       return setRows(appointmentJwtData);                                 
    }
  },[appointmentJwtData,Loading]);
    
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

export default AppointmentSwiper2



{/* <DataGrid
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
          /> */}