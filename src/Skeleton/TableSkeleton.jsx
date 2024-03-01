import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import TableSkeletonStyle from './Skeleton.module.css'

function TableSkeleton() {
  return (
    <div className={TableSkeletonStyle.table_skeleton_container}>
      {
        Array.from({ length: 10 }).map((__, index) => (
          <Skeleton variant="rounded" height={60} style={{marginBottom:"6.8px"}} key={index} />
        ))
      }
    </div>
  )
}

export default TableSkeleton