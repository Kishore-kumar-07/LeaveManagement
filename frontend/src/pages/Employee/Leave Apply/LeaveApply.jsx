import React from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";

function LeaveApply() {
  return (
    <div className="w-screen ">
      <div className="w-full flex justify-evenly">
      <Leaveform />
      <LeaveDetailTable />
      </div>

 
    </div>
  );
}

export default LeaveApply;
