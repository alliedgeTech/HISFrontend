import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/material/Unstable_Grid2";

function SlotsSkeleton() {
  return (
    <div>
    <Skeleton width={300} height={100}></Skeleton>
    <Grid container rowGap={3} paddingTop={9}>
    {
        Array(20).fill().map((item, index) => {
         return <Grid xs={2}><Skeleton key={index} style={{marginTop:"0.2rem"}} variant="rounded" height={60} width={100}></Skeleton></Grid>
        })
    }
    </Grid>
    </div>
  )
}

export default SlotsSkeleton