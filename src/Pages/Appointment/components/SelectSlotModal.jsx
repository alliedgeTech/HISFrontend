import React, { useEffect, useState } from "react";
import AddEditModal from "../../../Components/AddEditModal/AddEditModal";
import { useForm } from "react-hook-form";
import CustomDatePickerField from "../../../Components/InputsFilelds/CustomDatePickerField";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import BoxCalsses from "../../DoctorCalender/components/handleStepOne.module.css";
import toast from "react-hot-toast";
import SlotsSkeleton from "../../../Skeleton/SlotsSkeleton";
import EmptyData from "../../../Components/NoData/EmptyData";
import socket from "../../../socket";
import { Divider } from "@mui/material";

const dataColorSow = [
  {
    label: "Booked",
    color: "#25396f",
  },
  {
    color: "#ef5350",
    label: "Break",
  },
  {
    color: "#4caf50",
    label: "Remaning",
  },
  {
    color: "#9C27B0",
    label: "Selected",
  },
];

const ColorRender = ({ color, label }) => {
  return (
    <div className={BoxCalsses.text_icon_align + " " + BoxCalsses.colorWidth}>
      <div style={{ background: color }} className={BoxCalsses.ColorShow}></div>
      <div className={BoxCalsses.ColorLebal}>{label}</div>
    </div>
  );
};

function BreakSlot({ time, _id }) {
  return (
    <div
      className={BoxCalsses.slot}
      style={{ background: dataColorSow[1].color, cursor: "not-allowed" }}>
      {time}
    </div>
  );
}

function BookedSlot({ time, count, _id }) {
  return (
    <div
      className={BoxCalsses.slot}
      style={{ background: dataColorSow[0].color }}>
      <span>{time}</span>
      <span className={BoxCalsses.count}>{count}</span>
    </div>
  );
}

function SlotSBoxRender({
  booked,
  watchSlot,
  setSlotValue,
  slotBreak,
  startTime,
  tokenNumber,
  _id,
}) {

  if (slotBreak) {
    return <BreakSlot _id={_id} time={startTime} />;
  }

  if (booked) {
    return <BookedSlot time={startTime} _id={_id} count={tokenNumber} />;
  }
  return (
    <div
      style={{
        background:
          watchSlot === _id ? dataColorSow[3].color : dataColorSow[2].color,
        cursor: "pointer",
      }}
      className={BoxCalsses.slot}
      onClick={() => setSlotValue(watchSlot === _id ? null : _id)}>
      <span>{startTime}</span>
    </div>
  );
}



function SelectSlotModal({
  open,
  setSelectSlotModal,
  doctor,
  setValueFormSelectSlot,
  defaultValue,
  buttonText="Select Slot"
}) {

  const [slotsData, setSlotsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousJoinRoomDate, setPreviousJoinRoomDate] = useState(null);
  const { handleSubmit, control, clearErrors, reset, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        slot: defaultValue.time ? defaultValue.time : null,
        date: defaultValue.date ? dayjs(defaultValue.date) : dayjs(),
      },
      mode: "onTouched",
    });

  const setSlotValue = (id) => {
    setValue("slot", id);
  };

  const closeTheModal = () => {
    reset({
      slot: null,
      date: null,
    });
    clearErrors();
    previousJoinRoomDate && socket.emit("leaveRoom",[previousJoinRoomDate]);
    setSelectSlotModal(false);
  };

  const submitData = (data) => {
    if (!data?.slot) {
      toast.error("Please select slot from avaliable slots");
      return;
    }

    const tempData = {
      date: dayjs(data.date).format("YYYY-MM-DD"),
      slot: data.slot,
    };

    setSlotsData(null);
    setValueFormSelectSlot(tempData);
    closeTheModal();
  };

  function addSlots(slotsNewData){

    if(!slotsNewData || !Array.isArray(slotsData)) return ;
    const { uid,at,data } = slotsNewData;

    let oldData = JSON.parse(JSON.stringify(slotsData));

    oldData = oldData.map((obj) => {
      if(obj?.allSlots?.uid == uid) {
          if(Array.isArray(obj?.allSlots?.slots)){
              if(Number.isInteger(at)){
                  obj.allSlots.slots.splice(at,0,...data);
              } else {
                  obj.allSlots.slots = [...obj.allSlots.slots,...data];
              }
          } else {
              obj.allSlots.slots = data;
          }
          return obj;
      } else  {
          return obj;
      }
    })

    setSlotsData(oldData);
  }

  function deleteSlots(slotsDelete){
    
    if(!slotsDelete && !Array.isArray(slotsData)) {
      return ;
    }

    const { uid,data } = slotsDelete;
    let oldData = JSON.parse(JSON.stringify(slotsData));
    oldData = oldData.map((obj) => {
      if(obj?.allSlots?.uid == uid && Array.isArray(obj?.allSlots?.slots)) {
          obj.allSlots.slots = obj.allSlots.slots.filter((slot) => !data.includes(slot._id))
      } else {
          return obj;
      }

      setSlotsData(oldData);
  })

  }

  function updateSlots(updateSlots){

    if(!updateSlots && !Array.isArray(slotsData)) {
      return ;
    }

    const { uid,data } = updateSlots;
    
    let oldData = JSON.parse(JSON.stringify(slotsData));

    oldData = oldData.map((obj)=>{
      if(obj?.allSlots?.uid == uid && Array.isArray(obj.allSlots?.slots)){
          obj.allSlots.slots = obj.allSlots.slots.map((item)=>{
              const findSlotInData = data.find((updatedData)=> updatedData._id == item._id );;
              if(findSlotInData){
                  item = {...item,...findSlotInData};
              }
              return item;
          })
          return obj;
      } else {
          return obj;
      }
  })

  setSlotsData(oldData);
  } 

  function joinRoomAndGetSlots(roomId){
    socket.emit("joinRoom", [roomId]);
    socket.emit("slots", { type: "get", id:roomId}, (data)=>{
        if(!data.success){
          setSlotsData(null);
          setLoading(false);
          return toast.error(data.message);
        }
        setSlotsData(data?.value);
        setLoading(false); 

    });
    
  }

  const watchDate = watch("date");
  const watchSlot = watch("slot");

  useEffect(() => {

    if(slotsData){
      socket.on("slots", (data) => {
        switch(data?.type){
          case 'get':
            //* here we got all slots data
            setSlotsData(data?.data);
            setLoading(false);
            break;
  
          case 'add':
            // uid and data and at place we have to add
            addSlots(data);
            break;
  
          case 'delete':
            deleteSlots(data);
            break;
          
          case 'update':
            updateSlots(data);
            break;
  
        }
        
      });
    }

    return () => {
      socket.off("solts");
    }
  }, [slotsData]);

  useEffect(() => {
    if(open){
      if (watchDate && doctor && defaultValue.branch) {

        const key = `${doctor?._id}_${dayjs(watchDate).format("YYYY-MM-DD")}_${defaultValue.branch?._id}`
  
        if (previousJoinRoomDate) {
          socket.emit("leaveRoom", [previousJoinRoomDate]);
        }
  
        setLoading(true);
        joinRoomAndGetSlots(key)
        
        setPreviousJoinRoomDate(key);
      }
  
      return () => {
        if (previousJoinRoomDate) {
          socket.emit(
            "leaveRoom",
            [previousJoinRoomDate]
          );
          setPreviousJoinRoomDate(null);
        }
      };
    }
  }, [watchDate,open]);

  return (
    <AddEditModal
      maxWidth="lg"
      handleClose={closeTheModal}
      handleSubmit={handleSubmit(submitData)}
      open={open}
      modalTitle={`Select Slot's of ${doctor?.userName} `}
      isEdit={false}
      ButtonText={buttonText}>
      {loading ? (
        <SlotsSkeleton />
      ) : (
        <>
          <Grid
            container
            marginTop={3}
            spacing={{ md: 3, xs: 2 }}
            justifyContent="space-between"
            alignItems="center">
            <Grid item xs={12} md={6}>
              <CustomDatePickerField
                name={"date"}
                control={control}
                label={"Select Date For Slot"}
                minDate={new Date()}
                rules={{
                  valueAsDate: true,
                  required: {
                    value: true,
                    message: "Please select date for slot",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <div className={BoxCalsses.colorShowSlots}>
                {/**  booked break   */}
                {dataColorSow.map(({ color, label }, index) => (
                  <ColorRender color={color} label={label} key={index} />
                ))}
              </div>
            </Grid>
          </Grid>
          <div className={BoxCalsses.slotBodyContainer}>
              {slotsData && Array.isArray(slotsData) ? slotsData?.map((item, index) => {

                return  <>
                 {index > 0 && <Divider />}
                  <div className={BoxCalsses.slotBody}> 
                  { 
                    item.allSlots.slots.map((item2) => {
                     return <SlotSBoxRender
                      key={index}
                      uid={item?.allSlots?.uid}
                      {...item2}
                      setSlotValue={setSlotValue}
                      slotBreak={item2?.break}
                      watchSlot={watchSlot}
                    />
                    }) 
                  }
                </div>
                </>
              }) : <EmptyData /> }
            </div>
        </>
      )}
    </AddEditModal>
  );
}

export default SelectSlotModal;
