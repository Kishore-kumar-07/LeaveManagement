import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { useState,useEffect } from 'react';
import axios from 'axios';
import LeaveHistoryTable from './LeaveHistoryTable';
import PermissionHistoryTable from './PermissionHistoryTable';

function History() {
  const token = document.cookie.split('=')[1];
  console.log(token)
  const decodedToken = jwtDecode(token);

  const [leaveLogs , setLeaveLogs] = useState([]);
  const [permissionLogs , setPermissionLogs] = useState([]);


useEffect(()=>{
  getEmployeeLeaveLogs()
  getEmployeePermissionsLogs()
  console.log("Leave Logs",leaveLogs)
  console.log("Permission Logs",permissionLogs)
},[])


const getEmployeeLeaveLogs = async()=>{
  try{
    const res =await axios.post(`${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
    {
      empId:decodedToken.empId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    )
    setLeaveLogs(res.data);
    console.log("history",res)
  }
  catch(e){
    console.error("History Error",e)
  }
}

const getEmployeePermissionsLogs = async()=>{
  try{
    const res =await axios.post(`${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
    {
      empId:decodedToken.empId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    )
    setPermissionLogs(res.data);
    console.log("per",res)
  }
  catch(e){
    console.error("History Error",e)
  }
}
  return (
    <div className='h-full w-full flex justify-center items-center'>
    <h1>
    <LeaveHistoryTable LeaveLogs={leaveLogs}/>
        <PermissionHistoryTable PermissionLogs={permissionLogs}/>
    </h1>
   </div>
  )
}

export default History
