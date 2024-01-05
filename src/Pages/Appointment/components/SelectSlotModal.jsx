import React, { useEffect, useState } from 'react'
import AddEditModal from '../../../Components/AddEditModal/AddEditModal'
import { useForm } from 'react-hook-form'
import CustomDatePickerField from '../../../Components/InputsFilelds/CustomDatePickerField';
import Grid from '@mui/material/Unstable_Grid2';
import { socket } from '../../../socket';
import dayjs from 'dayjs';
import BoxCalsses from "../../DoctorCalender/components/handleStepOne.module.css"
import toast from 'react-hot-toast';

const dataColorSow = [
    {
      color: "#25396f",
      label: "Booked",
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
        color:"#9C27B0",
        label:"Selected"
    }
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
        style={{ background: dataColorSow[1].color,cursor:"not-allowed" }}>
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
    count,
    _id,
    ...props
  }) {
    
    if (slotBreak) {
      return (
        <BreakSlot
          _id={_id}
          time={startTime}
        />
      );
    }
  
    if (booked) {
      return (
        <BookedSlot
          time={startTime}
          _id={_id}
          count={count}
        />
      );
    }
    return (
      <div
        style={{background: watchSlot === _id ? dataColorSow[3].color : dataColorSow[2].color,cursor:"pointer"}}
        className={BoxCalsses.slot}
        onClick={() => setSlotValue(watchSlot===_id ? null : _id)}
        >
        <span>{startTime}</span>
      </div>
    );
}

function SelectSlotModal({open,setSelectSlotModal,doctor,setValueFormSelectSlot,defaultValue}) {
    const [slotsData, setSlotsData] = useState(null);
    let previousJoinRoomDate = null;
    const { handleSubmit,control,clearErrors,reset,watch,setValue } = useForm({
        defaultValues:{
            slot:defaultValue?.time ? defaultValue?.time : null,
            date:defaultValue?.date ? dayjs(defaultValue?.date) : dayjs()
        },
        mode:'onTouched'
    });
    const setSlotValue = (id) => {
        setValue("slot",id);
    }
    const closeTheModal = () => {
        reset({
            slot:null,
            date:null
        })
        clearErrors();
        setSelectSlotModal(false)
    }

    const submitData = (data) => {
        console.log("this is data : ",data);
        if(!data?.slot)
        {   
            toast.error("Please select slot from avaliable slots");
            return;
        }

        const tempData = { 
            date:dayjs(data.date.$d).format('YYYY-MM-DD'),
            slot:data.slot
        }
        setSlotsData(null);
        console.log('this is date',tempData)
        setValueFormSelectSlot(tempData);
        closeTheModal();
    }

    const watchDate = watch('date');
    const watchSlot = watch('slot');

    // useEffect(()=>{
    //   console.log("@@ default date : ",dayjs(defaultValue));
    //   setValue("date", defaultValue ? dayjs(defaultValue) : dayjs())
    // },[])

    useEffect(()=>{ 

        function onConnect() {
            console.log("@@this is solts data socket is connected");
            // socket.emit('joinRoom',`${roomId}_slots`,"admin");
        }

        function onDisconnect(){
            console.log("@@this is solts data socket is disconnected");
        }

        socket.connect();
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("soltsData",(data)=>{
            setSlotsData(data);
            console.log("this is solts data : ",data);
        })
        if(watchDate)
        { 
            console.log("this is watch date : ",watchDate, dayjs(watchDate.$d).format('YYYY-MM-DD'));
            if(previousJoinRoomDate)
            {
                socket.emit("leaveRoom",previousJoinRoomDate)
            }
            socket.emit('joinRoom',[`${dayjs(watchDate.$d).format('YYYY-MM-DD')}${doctor?._id}_slots`],"slots");
            previousJoinRoomDate = `${dayjs(watchDate.$d).format('YYYY-MM-DD')}${doctor?._id}_slots`
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            console.log('@@ disconnected')
            socket.off("soltsData");
            socket.emit("leaveRoom",`${dayjs(watchDate?.$d).format('YYYY-MM-DD')}${doctor?._id}_slots`)
            socket.disconnect()
        }
    },[watchDate]);

  return (
        <AddEditModal
        maxWidth="lg"
        handleClose={closeTheModal}
        handleSubmit={handleSubmit(submitData)}
        open={open}
        modalTitle={`Select Slot's of ${doctor?.userName} `}
        isEdit={false}
        ButtonText={"Select Slot"}
        >
               <Grid   
                container 
                marginTop={3}
                spacing={{ md:3 ,xs:2  }}
                // columns={{ xs: 4, sm: 8, md: 12 }}
                justifyContent="space-between"
                alignItems="center" 
              >   
                    <Grid item xs={12} md={6}>
                          <CustomDatePickerField 
                            name={"date"}
                            control={control}
                            label={"Select Date For Slot"}
                            rules={{valueAsDate:true,required:{value:true,message:"Please select date for slot"}}}
                          />
                    </Grid>

                    <Grid item xs={12} md={3} >
                        <div className={BoxCalsses.colorShowSlots}>
                            {/**  booked break   */}
                            {dataColorSow.map(({ color, label }, index) => (
                            <ColorRender color={color} label={label} key={index} />
                            ))}
                        </div>
                    </Grid>
                </Grid>
                    <div className={BoxCalsses.slotBody}>
                        { slotsData && slotsData?.slotsmasters?.slot?.map((item, index) => {
                        return (
                            <SlotSBoxRender
                            watchSlot={watchSlot}
                            setSlotValue={setSlotValue}
                            key={index}
                            {...item}
                            slotBreak={item?.break}
                            />
                        );
                        })}
                    </div>


        </AddEditModal>
    )
}

export default SelectSlotModal