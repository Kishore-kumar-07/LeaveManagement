import React, { useState } from "react";
import EmployeeUserDetails from "./EmployeeUserDetails";
import OptionsCard from "./OptionsCard";
import { FaPrint } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { MdWatchLater } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import LeaveApply from "./Leave Apply/LeaveApply";
import PermissionApply from "./Permission Apply/PermissionApply";
import History from "./History/History";
import PaySlip from "./Pay Slip/PaySlip";
import Nav from "./Nav";
import { jwtDecode } from "jwt-decode";
function EmployeeHome() {
  const [option, setOption] = useState("Home");
  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken);
  
  
  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-l from-[#DAF0FF] from-60% to-white flex flex-col">
        <Nav/>
        {option === "Home" ? (
          <div className="h-screen w-screen flex flex-col items-center justify-center">
          <div className="w-[90%] h-[90%] flex justify-around items-start ">
            <div className="h-[60%]">
              <EmployeeUserDetails />
            </div>
            <div className="flex flex-col w-[40%] gap-3 text-lg font-semibold">
              <OptionsCard
                name={"Pay Slip"}
                icon={<FaPrint />}
                setOption={setOption}
                value = "PaySlip"
              />
              <OptionsCard
                name={"Leave Apply"}
                icon={<SlCalender />}
                setOption={setOption}
                value = "Leave"
              />
              <OptionsCard
                name={"Permission Apply"}
                icon={<MdWatchLater />}
                setOption={setOption}
                value = "Permission"
              />
              <OptionsCard
                name={"History"}
                icon={<FaHistory />}
                setOption={setOption}
                value = "History"
              />
            </div>
          </div>
          </div>
        ) : option === "Leave" ? (
          <LeaveApply />
        ) : option === "Permission" ? (
          <PermissionApply />
        ) : option === "History" ? (
          <History />
        ) : option === "PaySlip" ? (
          <PaySlip />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default EmployeeHome;
