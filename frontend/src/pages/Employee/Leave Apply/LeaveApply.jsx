import React from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";

function LeaveApply({isPaternity}) {
  return (
    <div className="w-screen ">
      <div className="w-full flex justify-evenly">
      <Leaveform isPaternity={isPaternity}/>
      <LeaveDetailTable />
      </div>

 
    </div>
  );
}

export default LeaveApply;
