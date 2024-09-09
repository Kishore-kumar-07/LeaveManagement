import React from 'react'
import PermissionDetailTable from './PermissionDetailsTable'
import PermissionForm from './PermissionForm'



function PermissionApply() {
  return (
    <div className='h-screen w-screen flex justify-around items-center'>
     <PermissionForm/>
     <PermissionDetailTable/>
   </div>
  )
}

export default PermissionApply
