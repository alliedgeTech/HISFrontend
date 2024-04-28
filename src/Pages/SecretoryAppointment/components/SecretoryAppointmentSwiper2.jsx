import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import EmptyData from '../../../Components/NoData/EmptyData';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import TableSkeleton from '../../../Skeleton/TableSkeleton';
import { LinearProgress } from '@mui/material';
import TableClasses from '../../../Components/TableMainBox/TableMainBox.module.css'
import TableMainBox from '../../../Components/TableMainBox/TableMainBox';
import toast from 'react-hot-toast';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import socket from '../../../socket';
import { setSecretoryAppointmentJwtData, setSecretoryNewDataAppointmentJwtData, setSecretoryRemovedAppointmentJwtData, setSecretoryUpdatedAppointmentJwtData } from '../../../slices/secretoryAppointment.slice';

function SecretoryAppointmentSwiper2() {
    const  { doctorAppointmentList,appointmentJwtData,branch } = useSelector((state) => state.secretoryAppointment);
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
    let key = "_"+GetTodayDate()+"_"+branch?._id+"_"+"appointmentJwt";
    if(doctorAppointmentList?._id) key = doctorAppointmentList?._id+"_"+GetTodayDate()+"_"+branch?._id+"_"+"appointmentJwt";

    socket.emit("joinRoom", [key]);
    socket.emit("appointmentJwt",{ key,type:'get' },(data) => {
      dispatch(setSecretoryAppointmentJwtData(data));
      setLoading(false);
    });

    // socket.on("appointment_jwt", (data) => {
    //     dispatch(setAppointmentJwtData(data));
    //     setLoading(false);
    // });

    //generatedJWtToken_listAppointment
    socket.on("appointmentJwt",(data) => {
      if(!data || !data.data ) return;
      switch (data.type) {
        case "add":
          dispatch(setSecretoryNewDataAppointmentJwtData(data.data));
          break;
        case "update":
          dispatch(setSecretoryUpdatedAppointmentJwtData(data.data));
          break;
        case "remove":
          dispatch(setSecretoryRemovedAppointmentJwtData(data.data))
          break;
        default:
          break;
      }
    })
   
    return () => {
      socket.off("appointmentJwt");
      socket.emit("leaveRoom", key);
    };
  }, []);

  function emitInTimeEvent(_id){
      let tempData = {
        _id,
        inTime: GetHourAndMin(),
      }

      socket.emit("appointmentJwt",{type:"inTime",data:tempData,key: doctorAppointmentList?._id + "_" + GetTodayDate() + "_" + branch?._id + "_" + "appointmentJwt"},()=>{
        toast.error("Something went wrong");
      });
  }

  function emitOutTimeEvent(_id)
  {

    let tempData = {
      _id,
      outTime:GetHourAndMin(),
    }
    socket.emit("appointmentJwt",{ type:'outTime',data:tempData,key:doctorAppointmentList?._id+"_"+GetTodayDate()+"_"+branch?._id+"_"+"appointmentJwt"},() =>{
      toast.error("Something went wrong");
    })

    // socket.emit("appointment_outTime",tempData,() =>{
    //   toast.error("Something went wrong");
    // });
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
      renderCell: (params) => 
        { return params.row.isActive && <div style={{gap:20,display:"flex"}}>
          <div
          style={{cursor:"pointer"}}
          onClick={() => { emitInTimeEvent(params?.row?._id) }}>
            <WatchLaterOutlinedIcon/>
          </div>
          <div 
              style={{cursor:"pointer"}}
            onClick={()=>{ if(params.row.inTime) {emitOutTimeEvent(params?.row?._id)} else toast.error("Please click on In Time first")}}
          >
            <AlarmOnOutlinedIcon />
          </div>

        </div>},
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
        startTime:element?.time?.startTime || element?.currentTime,
        inTime:element?.inTime,
        outTime:element?.outTime,
        isActive:element?.isActive,
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
            getRowClassName={(params) => !params?.row?.isActive && "inactive-row"}
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

export default SecretoryAppointmentSwiper2



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