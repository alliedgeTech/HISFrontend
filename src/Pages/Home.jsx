import React from 'react'
import './Home.css'
import TableMainBox from '../Components/TableMainBox/TableMainBox'
function Home() {
  return (
    <TableMainBox title={"Users"} buttonText={"Add User"} onClick={() => console.log("hey boys")}>
    </TableMainBox>
  )
}

export default Home;