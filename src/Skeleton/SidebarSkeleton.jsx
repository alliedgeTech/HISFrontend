import React from 'react'
import Skeleton from '@mui/material/Skeleton';

function SidebarSkeleton() {
  return (
    <>
      {
        Array(10).fill().map((item, index) => {
         return <Skeleton key={index} style={{marginTop:"0.2rem"}} variant="rounded" height={60}></Skeleton>
        })
      }
    </>
  )
}

export default SidebarSkeleton