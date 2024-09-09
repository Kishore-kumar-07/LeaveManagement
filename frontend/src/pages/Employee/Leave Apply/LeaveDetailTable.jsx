import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

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
  const decodedToken = jwtDecode(token);

  useEffect(() => {
    getTableData();
  }, []); 

  const getTableData = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/table/getDetails`,
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
      const fetchedData = res.data;

      const newData = [
        {
          col1: "Op Balance",
          col2: fetchedData.plDetails ? fetchedData.plDetails.opBalance : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.opBalance : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.opBalance
            : 0,
        },
        {
          col1: "Eligibility",
          col2: fetchedData.plDetails ? fetchedData.plDetails.eligibility : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.eligibility : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.eligibility
            : 0,
        },
        {
          col1: "Total Eligibility",
          col2: fetchedData.plDetails
            ? fetchedData.plDetails.totalEligibility
            : 0,
          col3: fetchedData.clDetails
            ? fetchedData.clDetails.totalEligibility
            : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.totalEligibility
            : 0,
        },
        {
          col1: "Availed",
          col2: fetchedData.plDetails ? fetchedData.plDetails.availed : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.availed : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.availed
            : 0,
        },
        {
          col1: "LOP",
          col2: fetchedData.plDetails ? fetchedData.plDetails.LOP : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.LOP : 0,
          col4: fetchedData.paternityLeave ? fetchedData.paternityLeave.LOP : 0,
        },
        {
          col1: "Leave Lapsed",
          col2: fetchedData.plDetails ? fetchedData.plDetails.leaveLapsed : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.leaveLapsed : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.leaveLapsed
            : 0,
        },
        {
          col1: "Leave Encashed",
          col2: fetchedData.plDetails ? fetchedData.plDetails.leaveEncashed : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.leaveEncashed : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.leaveEncashed
            : 0,
        },
        {
          col1: "Closing Balance",
          col2: fetchedData.plDetails
            ? fetchedData.plDetails.closingBalance
            : 0,
          col3: fetchedData.clDetails
            ? fetchedData.clDetails.closingBalance
            : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.closingBalance
            : 0,
        },
        {
          col1: "Max Leave Carry Forward",
          col2: fetchedData.plDetails ? fetchedData.plDetails.carryForward : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.carryForward : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.carryForward
            : 0,
        },
        {
          col1: "Availed(Including future month leave availed)",
          col2: fetchedData.plDetails ? fetchedData.plDetails.futureAvailed : 0,
          col3: fetchedData.clDetails ? fetchedData.clDetails.futureAvailed : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.futureAvailed
            : 0,
        },
        {
          col1: "Closing Balance(Including future month leave availed)",
          col2: fetchedData.plDetails
            ? fetchedData.plDetails.futureClosingBalance
            : 0,
          col3: fetchedData.clDetails
            ? fetchedData.clDetails.futureClosingBalance
            : 0,
          col4: fetchedData.paternityLeave
            ? fetchedData.paternityLeave.futureClosingBalance
            : 0,
        },
      ];
      console.log(newData)
      setTableData(newData);
    } catch (error) {
      console.error("Error fetching table data", error);
    }
  };

  return (
    <div className="w-[40%] h-fit border-2  border-cyan-100 mr-5 rounded-lg overflow-hidden shadow-lg shadow-zinc-500">
      <div className="bg-gradient-to-l from-[#DAF0FF] to-white">
        <table className="min-w-full border-collapse rounded-lg text-sm">
          <thead>
            <tr className="text-left ">
              <th className="py-3 px-4  text-md text-gray-800 border-b font-bold text-[2.2vh]">
                Leave Type
              </th>
              <th className="py-3 px-4  text-md text-gray-800 border-b font-bold text-[2.2vh]">
                Privilege Leave
              </th>
              <th className="py-3 px-4 text-md text-gray-800 border-b font-bold text-[2.2vh]">
                Casual Leave
              </th>
              <th className="py-3 px-4 text-md text-gray-800 border-b font-bold text-[2.2vh]">
                Paternity Leave
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-3 px-4 border-b  text-gray-700 font-semibold text-[2.2vh]">
                  {row.col1}
                </td>
                <td className="py-3 px-4 border-b text-gray-700 text-[2.2vh]">
                  {row.col2}
                </td>
                <td className="py-3 px-4 border-b text-gray-700 text-[2.2vh]">
                  {row.col3}
                </td>
                <td className="py-3 px-4 border-b text-gray-700 text-[2.2vh]">
                  {row.col4}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveDetailTable;
