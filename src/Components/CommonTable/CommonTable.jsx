import React, { memo } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


function CommonTable({ paginationModel, columns, rowData, count, activeInActiveNeeded=true,onPaginationChange=()=>null, customHeight="173px"}) {
    console.log("this is time to render again inside")
  return (
    <DataGrid
            style={{maxHeight:`calc(100vh - ${customHeight})`}}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: paginationModel.pageSize,
                  page: paginationModel.page,
                },
              },
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
            paginationModel={paginationModel}
            getRowClassName={(params) => !params?.row?.isActive && activeInActiveNeeded && "inactive-row"}
            onPaginationModelChange={(data) => onPaginationChange(data)}
            rowCount={count}
            pagination
            pageSizeOptions={[10, 30, 50, 100]}
            paginationMode="server"
          />
  )
}

export default memo(CommonTable)