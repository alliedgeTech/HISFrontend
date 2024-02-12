import React, { useMemo, useState } from "react";
import { useSocMasterData } from "../../services/Billing/SocMaster";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { setSocEditData, setSocPagination } from "../../slices/soc.slice";
import TableMainBox from "../../Components/TableMainBox/TableMainBox";
import TableSkeleton from "../../Skeleton/TableSkeleton";
import CommonTable from "../../Components/CommonTable/CommonTable";
import EmptyData from "../../Components/NoData/EmptyData";
import CustomIconButton from "../../Components/CustomeIcons/CustomEditIcons";
import { Box, LinearProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddEditModal from "../../Components/AddEditModal/AddEditModal";
import CustomAutoCompelete from "../../Components/CustomAutoCompelete/CustomAutoCompelete";
import { CustomTextInputField } from "../../Components/InputsFilelds/CustomTextInputField";

function SocMaster() {
  const { createSocMaster, getSocMasterData, listLoading, updateSocMaster } =
    useSocMasterData();
  const {
    socData,
    socLoading,
    editSocData,
    socCount,
    socPagination: paginationModel,
  } = useSelector((state) => state.soc);
  var {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    clearErrors,
  } = useForm({
    defaultValues: {
      tarrif: "",
      bedType: [],
      price: "",
      effectiveFromDate: new Date(),
      service: "",
      emrPrice: "",
    },
    mode: "onTouched",
  });

  const dispatch = useDispatch();
  const [OpenModal, setOpenModal] = useState(false);

  const CloseModal = () => {
    setOpenModal(false);
    dispatch(setSocEditData(null));
    clearErrors();
    reset({
      tarrif: "",
      bedType: [],
      price: "",
      effectiveFromDate: new Date(),
      service: "",
      emrPrice: "",
    });
  };

  const onPaginationChange = async ({ page, pageSize }) => {
    if (
      page !== paginationModel.page ||
      pageSize !== paginationModel.pageSize
    ) {
      const recentState = structuredClone(paginationModel);
      dispatch(setSocPagination({ page, pageSize }));
      if (page !== recentState.page) {
        // change the page
        const resData = await getSocMasterData(true, page, pageSize);
        if (!resData) {
          dispatch(setSocPagination(recentState));
        }
      } else {
        // change the pageSize
        const resData = await getSocMasterData(true, 0, pageSize);

        if (!resData) {
          dispatch(setSocPagination(recentState));
        }
      }
    }
  };

  var submitData = async (data) => {
    console.log("Soc Master form data", data);

    if (editSocData) {
      let temp = await updateSocMaster(data);
      if (temp) {
        CloseModal();
      }
    } else {
      delete data?._id;
      let temp = await createSocMaster(data);
      if (temp) {
        CloseModal();
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    { field: "_id", headerName: "", width: "0" },
    {
      field: "tarrif",
      headerName: "Tarrif",
      flex: 1,
      renderCell: (params) => params.row?.tarrif?.tariffName,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "service",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row?.service?.serviceName,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "servicType",
      headerName: "Service Type",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => params.row?.service?.serviceType?.serviceTypeName,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          {
            <div
              className="btn btn-sm"
              onClick={() => {
                clearErrors();
                dispatch(setSocEditData(true));
                setOpenModal(true);
                reset({
                  // set the data for edit time
                });
              }}>
              <CustomIconButton />
            </div>
          }
        </>
      ),
    },
  ];

  const setRows = (data) => {
    var id = paginationModel.page * paginationModel.pageSize;
    var array = [];
    data?.forEach((element) => {
      let thisData = {
        id: ++id,
        _id: element?._id,
        tarrif: element?.tarrif,
        service: element?.service,
        servicType: element?.service?.serviceType,
      };
      array.push(thisData);
    });
    return array;
  };

  const rowData = useMemo(() => {
    if (
      socData !== undefined &&
      Array.isArray(socData) &&
      listLoading === false
    ) {
      return setRows(socData);
    }
  }, [socData, listLoading]);

  return (
    <>
      <AddEditModal
        maxWidth="lg"
        handleClose={CloseModal}
        handleSubmit={handleSubmit(submitData)}
        open={OpenModal}
        modalTitle={editSocData ? `Update Service` : `Add Service`}
        isEdit={!!editSocData}
        Loading={socLoading}>
        <Box component="form" onSubmit={handleSubmit(submitData)} p={1}>
          <Grid
            container
            spacing={{ md: 3, xs: 2 }}
            // columns={{ xs: 4, sm: 8, md: 12 }}
            justifyContent="space-between"
            alignItems="center">
            <Grid xs={12} sm={4}>
              <Controller
                name="service"
                control={control}
                rules={{ required: "service is required" }}
                render={({ field, fieldState: { error } }) => {
                  const { onChange, value, ref, onBlur } = field;
                  return (
                    <CustomAutoCompelete
                      onChange={onChange}
                      lable={"Select service "}
                      hasError={error}
                      focused={true}
                      value={value}
                      onBlur={onBlur}
                      inputRef={ref}
                      url={"admin/billing/serviceMaster"}
                      getOptionLabel={(option) =>
                        `${option?.serviceName} (${option?.serviceType?.serviceTypeName})`
                      }
                      filterOnActive={true}
                    />
                  );
                }}
              />
              {errors.service && (
                <Typography variant="caption" color="error">
                  Service is required
                </Typography>
              )}
            </Grid>

            <Grid
              container
              spacing={{ md: 3, xs: 2 }}
              // columns={{ xs: 4, sm: 8, md: 12 }}
              justifyContent="space-between"
              alignItems="center">
              <Grid xs={12} sm={4}>
                <Controller
                  name="tarrif"
                  control={control}
                  rules={{ required: "tarrif is required" }}
                  render={({ field, fieldState: { error } }) => {
                    const { onChange, value, ref, onBlur } = field;
                    return (
                      <CustomAutoCompelete
                        onChange={onChange}
                        lable={"Select tarrif "}
                        hasError={error}
                        focused={true}
                        value={value}
                        onBlur={onBlur}
                        inputRef={ref}
                        url={"admin/addMaster/tarrifMaster"}
                        getOptionLabel={(option) =>
                          `${option?.serviceName} (${option?.tariffName})`
                        }
                        filterOnActive={true}
                      />
                    );
                  }}
                />
                {errors.service && (
                  <Typography variant="caption" color="error">
                    Tarrif is required
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid xs={12} sm={3}>
              <CustomTextInputField
                type="number"
                name={"price"}
                control={control}
                label={"Price"}
                rules={{
                  required: { value: true, message: "price is required" },
                  min: { value: 0, message: "min value 0 is required" },
                }}
              />
            </Grid>

            <Grid xs={12} sm={3}>
              <CustomTextInputField
                type="number"
                name={"emrprice"}
                control={control}
                label={"Emr Price"}
                rules={{
                  required: { value: true, message: "emr price is required" },
                  min: { value: 0, message: "min value 0 is required" },
                }}
              />
            </Grid>


          </Grid>
        </Box>
      </AddEditModal>

      <TableMainBox
        title={"Soc Master"}
        buttonText={"Add Soc"}
        onClick={() => {
          setOpenModal(true);
          clearErrors();
        }}>
        {listLoading ? (
          <>
            <LinearProgress />
            <TableSkeleton />
          </>
        ) : Array.isArray(rowData) && rowData.length > 0 ? (
          <CommonTable
            columns={columns}
            count={socCount}
            paginationModel={paginationModel}
            rowData={rowData}
            onPaginationChange={onPaginationChange}
            activeInActiveNeeded={false}
          />
        ) : (
          <EmptyData />
        )}
      </TableMainBox>
    </>
  );
}

export default SocMaster;
