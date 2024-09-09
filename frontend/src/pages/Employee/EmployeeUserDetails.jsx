import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import UserIcon from "./assets/user.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeUserDetails() {
  const details = [
    ["Designation", "Designation"],
    ["Reporting Manager", "Kishore Kumar k"],
    ["DOJ", "22/07/2022"],
    ["Function", "Probation"],
    ["Department", "Human Resource"],
    ["Band/Level", "Individual Contributer"],
    ["Location", "Coimbatore"],
  ];

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/emp/getEmp",
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
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [empId, token]);
  return (
    <>
      <div className="w-full flex flex-col gap-5 p-5  ">
        <div className="w-full   flex justify-center items-center">
          <img src={UserIcon} alt="USER PROFILE" className="w-20 " />
        </div>
        <div className="flex items-center gap-3 text-3xl font-bold">
          <h1 className="text-center w-full">{decodedToken.empName}</h1>
        </div>

        <div className="">
        <table className='text-gray-700 mt-2 w-full break-words'>
                    <tbody className="flex flex-col gap-3">
                      <tr>
                        <td className='font-medium text-xl w-32'>Designation:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.designation}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>Reporting Manager:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.reportionManager}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>DOJ:</td>
                        <td  className='break-words text-lg font-normal'>{userDetails.dateOfJoining}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>Function:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.function}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>Department:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.department}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>Band/Level:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.level}</td>
                      </tr>
                      <tr>
                        <td className='font-medium text-xl w-32'>Location:</td>
                        <td className='break-words text-lg font-normal'>{userDetails.location}</td>
                      </tr>
                    </tbody>
                  </table>
        </div>
      </div>
    </>
  );
}

export default EmployeeUserDetails;
