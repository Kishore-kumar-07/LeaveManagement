import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { enUS } from "@mui/x-date-pickers/locales";

function LeaveDetailTable() {
  const [data, setData] = useState({});
  const [tableData, setTableData] = useState([
    {
      col1: "Op Balance",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Eligibility",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Total Eligibility",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Availed",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "LOP",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Leave Lapsed",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Leave Encashed",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Closing Balance",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Max Leave Carry Forward",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Availed(Including future month leave availed)",
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      col1: "Closing Balance(Including future month leave availed)",
      col2: 0,
      col3: 0,
      col4: 0,
    },
  ]);

  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken.empId);

  useEffect(() => {
    getTableData();
  }, [tableData]);

  const getTableData = async () => {
    try {
      console.log("start");
      const res = await axios.post(
        "http://localhost:5000/table/getDetails",
        {
          empId: decodedToken.empId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setData(res.data);

      const newData = [
        {
          col1: "Op Balance",
          col2: data.plDetails ? data.plDetails.opBalance : 0,
          col3: data.clDetails ? data.clDetails.opBalance : 0,
          col4: data.plDetails ? data.paternityLeave.opBalance : 0,
        },
        {
          col1: "Eligibility",
          col2: data.plDetails ? data.plDetails.eligibility : 0,
          col3: data.clDetails ? data.clDetails.eligibility : 0,
          col4: data.plDetails ? data.paternityLeave.eligibility : 0,
        },
        {
          col1: "Total Eligibility",
          col2: data.plDetails ? data.plDetails.totalEligibility : 0,
          col3: data.clDetails ? data.clDetails.totalEligibility : 0,
          col4: data.plDetails ? data.paternityLeave.totalEligibility : 0,
        },
        {
          col1: "Availed",
          col2: data.plDetails ? data.plDetails.availed : 0,
          col3: data.clDetails ? data.clDetails.availed : 0,
          col4: data.plDetails ? data.paternityLeave.availed : 0,
        },
        {
          col1: "LOP",
          col2: data.plDetails ? data.plDetails.LOP : 0,
          col3: data.clDetails ? data.clDetails.LOP : 0,
          col4: data.plDetails ? data.paternityLeave.LOP : 0,
        },
        {
          col1: "Leave Lapsed",
          col2: data.plDetails ? data.plDetails.leaveLapsed : 0,
          col3: data.clDetails ? data.clDetails.leaveLapsed : 0,
          col4: data.plDetails ? data.paternityLeave.leaveLapsed : 0,
        },
        {
          col1: "Leave Encashed",
          col2: data.plDetails ? data.plDetails.leaveEncashed : 0,
          col3: data.clDetails ? data.clDetails.leaveEncashed : 0,
          col4: data.plDetails ? data.paternityLeave.leaveEncashed : 0,
        },
        {
          col1: "Closing Balance",
          col2: data.plDetails ? data.plDetails.closingBalance : 0,
          col3: data.clDetails ? data.clDetails.closingBalance : 0,
          col4: data.plDetails ? data.paternityLeave.closingBalance : 0,
        },
        {
          col1: "Max Leave Carry Forward",
          col2: data.plDetails ? data.plDetails.carryForward : 0,
          col3: data.clDetails ? data.clDetails.carryForward : 0,
          col4: data.plDetails ? data.paternityLeave.carryForward : 0,
        },
        {
          col1: "Availed(Including future month leave availed)",
          col2: data.plDetails ? data.plDetails.futureAvailed : 0,
          col3: data.clDetails ? data.clDetails.futureAvailed : 0,
          col4: data.plDetails ? data.paternityLeave.futureAvailed : 0,
        },
        {
          col1: "Closing Balance(Including future month leave availed)",
          col2: data.plDetails ? data.plDetails.futureClosingBalance : 0,
          col3: data.clDetails ? data.clDetails.futureClosingBalance : 0,
          col4: data.plDetails ? data.paternityLeave.futureClosingBalance : 0,
        },
      ];

      setTableData(newData);
      console.log("data", res.data);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };

  console.log("Check Data", data);

  return (
    <div className="w-[30%] h-fit border-2  border-cyan-100 mr-5 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gradient-to-l from-[#DAF0FF] to-white">
        <table className="min-w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr className="text-left ">
              <th className="py-3 px-4 font-semibold text-lg text-gray-800 border-b">Leave Type</th>
              <th className="py-3 px-4 font-semibold text-lg text-gray-800 border-b">Privilege Leave</th>
              <th className="py-3 px-4 font-semibold text-lg text-gray-800 border-b">Casual Leave</th>
              <th className="py-3 px-4 font-semibold text-lg text-gray-800 border-b">Paternity Leave</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className=" hover:bg-gray-100">
                <td className="py-3 px-4 border-b text-md text-gray-700">{row.col1}</td>
                <td className="py-3 px-4 border-b text-gray-700">{row.col2}</td>
                <td className="py-3 px-4 border-b text-gray-700">{row.col3}</td>
                <td className="py-3 px-4 border-b text-gray-700">{row.col4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveDetailTable;
