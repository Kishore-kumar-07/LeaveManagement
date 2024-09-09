import React from "react";
import UserIcon from "./assets/user.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeUserDetails({setIsPaternity}) {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});

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
          navigate("/thank-you");
        }

        setUserDetails(res.data[0]);
        setIsPaternity(userDetails.isPaternity)

      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [empId, token]);

  return (
    <>
      <div className="w-full flex flex-col gap-5 p-5">
        <div className="w-full flex justify-center pr-48 items-center">
          <img src={UserIcon} alt="USER PROFILE" className="w-20 " />
        </div>
        <div className="flex items-center gap-3 text-3xl pr-48 font-bold justify-center">
          <h1>{decodedToken.empName}</h1>
        </div>

        <table className="table-auto w-full mt-5 text-left">
          <tbody>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Designation:</td>
              <td className="text-lg py-2">{userDetails.designation}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Reporting Manager:</td>
              <td className="text-lg py-2">{userDetails.reportionManager}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">DOJ:</td>
              <td className="text-lg py-2">{userDetails.dateOfJoining}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Function:</td>
              <td className="text-lg py-2">{userDetails.function}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Department:</td>
              <td className="text-lg py-2">{userDetails.department}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Band/Level:</td>
              <td className="text-lg py-2">{userDetails.level}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Location:</td>
              <td className="text-lg py-2">{userDetails.location}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployeeUserDetails;
