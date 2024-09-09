import React from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";

function LeaveApply() {
  return (
    <div className=" h-screen w-screen flex  items-center justify-start ">
      <Leaveform />
      <LeaveDetailTable />
 
    </div>
  );
}

export default LeaveApply;
