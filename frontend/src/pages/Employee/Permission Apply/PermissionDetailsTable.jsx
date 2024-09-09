import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const PermissionDetailTable = () => {
  const [userDetails, setUserDetails] = useState({});
  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  console.log("in", decodedToken.empId);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/emp/getEmp`,
          { empId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status === 401) {
          console.log("yes");
        }

        setUserDetails(res.data[0]);
        console.log(res.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-96">
        <h1 className="text-2xl font-bold text-center mb-5">
          Permission Status
        </h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <tbody>
            <div>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="w-full py-4 px-6 border-b border-gray-200 text-gray-600 text-lg font-bold text-left">
                  Total Permission
                </td>
                <td className="py-4 px-6 border-b border-gray-200  text-lg  text-gray-700 text-center">
                  4
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 border-b border-gray-200 text-gray-600 font-bold  text-lg  text-left">
                  Permission Avalied
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700  text-lg  text-center">
                  {userDetails.permissionAvailed}
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 border-b border-gray-200 text-gray-600  text-lg  font-bold text-left">
                  Permission Remaining
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-gray-700  text-lg  text-center">
                  {4 - userDetails.permissionAvailed}
                </td>
              </tr>
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionDetailTable;
