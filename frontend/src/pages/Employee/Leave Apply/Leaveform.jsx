import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { render } from "@react-email/render";
import "react-toastify/dist/ReactToastify.css";
import LeaveNotification from "./LeaveNotification";
import EmailTemplate from "./EmailTemplate";

const Leaveform = () => {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState(null);
  const [isHalfDayFrom, setIsHalfDayFrom] = useState(false);
  const [isHalfDayTo, setIsHalfDayTo] = useState(false);
  const [fromHalf, setFromHalf] = useState("");
  const [toHalf, setToHalf] = useState("");
  const [leaveReason, setLeaveReason] = useState("Personal");
  const [leaveDescription, setLeaveDescription] = useState("Nothing");
  const [popupVisible, setPopupVisible] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({});
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [summary, setSummary] = useState("");
  const [isLOP, setIsLOP] = useState(false);
  // const [isAppliedLeave, setIsAppliedLeave] = useState(false);

  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken.empId);

  const handleLOP = () => {
    setIsLOP(!isLOP);
    // setIsAppliedLeave(!isAppliedLeave);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log("Cancelled!");
    setIsLOP(!isLOP);
    // setIsAppliedLeave(!isAppliedLeave);
    setPopupVisible(!popupVisible);
  };

  const checkLeave = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/leave/checkLeave",
        {
          empId: decodedToken.empId,
          role: decodedToken.role,
          leaveType: leaveType,
          from: {
            date: fromDate,
            firstHalf: false,
            secondHalf: false,
          },
          numberOfDays: calculateLeaveDays(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 202) {
        toast.error("Date is Already Applied");
      } else {
        setSummary(res.data);
        handleLOP();
      }
    } catch (e) {
      toast.error("Somthing went wrong");
    }
  };

  const calculateLeaveDays = () => {
    if (!fromDate || !toDate) return 0;

    const diffInTime = toDate.getTime() - fromDate.getTime();
    const totalDays = diffInTime / (1000 * 3600 * 24) + 1;

    let adjustedDays = totalDays;

    if (isHalfDayFrom) adjustedDays -= 0.5;
    if (isHalfDayTo) adjustedDays -= 0.5;

    return adjustedDays;
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/leave/apply",
        {
          empId: decodedToken.empId,
          empName: decodedToken.empName,
          role: decodedToken.role,
          leaveType: leaveType,
          from: {
            date: formatDate(fromDate),
            firstHalf: false,
            secondHalf: false,
          },
          to: {
            date: formatDate(toDate),
            firstHalf: false,
            secondHalf: false,
          },
          numberOfDays: calculateLeaveDays(),
          reasonType: leaveReason,
          reason: leaveDescription,
          LOP: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ksdhfgiyrsgbrwnh");
      if (res.status === 201) {
        alert("Leave Requested Successfully");
        console.log(res.data.leave._id)
        sendLeaveEmail(res.data.leave._id,"false")
      } else {
        toast.error("Error in requesting Leave");
      }

      var data = res.data;
      console.log(data.leave._id);

      // sendLeaveEmail(data.leave._id, "True");

      console.log("data", res.data);
    } catch (error) {
      console.error("Error Leave Apply", error);
    } finally {
      // setIsAppliedLeave(!isAppliedLeave);
      // setIsLOP(!isLOP);
    }
  };

  const sendLeaveEmail = async (objId, LOP) => {
  
    const emailContent = await render(
      <EmailTemplate
        empId={decodedToken.empId}
        leaveType={leaveType}
        fromDate={fromDate.toLocaleDateString("en-GB")}
        toDate={toDate.toLocaleDateString("en-GB")}
        leaveReason={leaveReason}
        fromDay="Full Day"
        toDay="Full Day"
        userName={decodedToken.empName}
        imageUrl="https://www.gilbarco.com/us/sites/gilbarco.com.us/files/2022-07/gilbarco_logo.png"
        leaveId={objId}
        LOP={LOP}
        leaveDescription={leaveDescription}
      />
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/mail/send",
        {
          email: "mohammedashif.a2022cse@sece.ac.in",
          html: emailContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // navigate("/thank-you");
        alert("thank you");
      } else {
        toast.error("Error in sending Email");
      }
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
      alert("Error sending email");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalDays = calculateLeaveDays();
    const halfDayInfo = {
      fromHalf: isHalfDayFrom ? fromHalf : "Full Day",
      toHalf: isHalfDayTo ? toHalf : "Full Day",
    };

    setLeaveDetails({
      fromDate: fromDate ? fromDate.toLocaleDateString("en-GB") : "",
      toDate: toDate ? toDate.toLocaleDateString("en-GB") : "",
      leaveReason,
      leaveDescription,
      totalDays,
      halfDayInfo,
      leaveType,
    });

    setPopupVisible(true);
  };

  const handleFromDayTypeChange = (type) => {
    setIsHalfDayFrom(type === "half");
  };

  const handleToDayTypeChange = (type) => {
    setIsHalfDayTo(type === "half");
  };

  const handleLeaveReasonChange = (reason) => {
    setLeaveReason(reason);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };
  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  
  return (
    <div className="w-[50%] py-8  mx-auto  border-2   rounded-lg bg-gradient-to-l from-[#DAF0FF] to-white shadow-xl flex flex-col justify-center items-center flex-wrap">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-800">
        Apply for Leave
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 justify-center items-start"
      >
        {/* Leave Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-xl font-semibold">Leave Type</label>
          <div className="flex gap-4">
            {["Casual Leave", "Privilege Leave", "Paternity Leave"].map(
              (type) => (
                <label key={type} className="flex items-center text-lg  ">
                  <input
                    type="radio"
                    name="leaveType"
                    value={type}
                    checked={leaveType === type}
                    onChange={() => setLeaveType(type)}
                    className="mr-2"
                  />
                  {type}
                </label>
              )
            )}
          </div>
        </div>

        {/* From Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-lg">From Date</label>
          <div>

          
          <div className="flex flex-row gap-4 items-center">
            <DatePicker
              selected={fromDate}
              onChange={(date) => {
                setFromDate(date);
                setToDate(date);
              }}
              filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
              minDate={new Date()}
              maxDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
              }
              className="w-full border rounded-md p-2 focus:outline-none focus:ring"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select From Date"
            />
            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                type="button"
                onClick={() => handleFromDayTypeChange("half")}
                className={`p-2 rounded-md ${
                  isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Half Day
              </button>
              <button
                type="button"
                onClick={() => handleFromDayTypeChange("full")}
                className={`p-2 rounded-md ${
                  !isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Full Day
              </button>
            </div>
            </div>
            {isHalfDayFrom && (
              <div className="mt-2 flex gap-4">
                {["First Half", "Second Half"].map((half) => (
                  <label key={half} className="flex items-center">
                    <input
                      type="radio"
                      name="halfDayFrom"
                      value={half}
                      checked={fromHalf === half}
                      onChange={() => setFromHalf(half)}
                      className="mr-2"
                    />
                    {half}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* To Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-lg">To Date</label>
          <div>
          <div className="flex flex-row gap-4 items-center">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              filterDate={(date) =>
                date.getDay() !== 0 &&
                date.getDay() !== 6 &&
                date.getMonth() === fromDate?.getMonth()
              }
              minDate={fromDate}
              maxDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
              }
              className="w-full border rounded-md p-2 focus:outline-none focus:ring"
              dateFormat="dd/MM/yyyy"
              placeholderText="Select To Date"
            />
            <div className="flex gap-4 mt-4 md:mt-0">
              <button
                type="button"
                onClick={() => handleToDayTypeChange("half")}
                className={`p-2 rounded-md ${
                  isHalfDayTo ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Half Day
              </button>
              <button
                type="button"
                onClick={() => handleToDayTypeChange("full")}
                className={`p-2 rounded-md ${
                  !isHalfDayTo ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Full Day
              </button>
            </div>
                 
          </div>
            {isHalfDayTo && (
              <div className="mt-2 flex gap-4">
                {["First Half", "Second Half"].map((half) => (
                  <label key={half} className="flex items-center">
                    <input
                      type="radio"
                      name="halfDayTo"
                      value={half}
                      checked={toHalf === half}
                      onChange={() => setToHalf(half)}
                      className="mr-2"
                    />
                    {half}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leave Reason */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-lg">
            Leave Reason
          </label>
          <div className="flex gap-4">
            {["Personal", "Medical", "Vacation", "Other"].map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="leaveReason"
                  value={reason}
                  checked={leaveReason === reason}
                  onChange={() => handleLeaveReasonChange(reason)}
                  className="mr-2"
                />
                {reason}
              </label>
            ))}
          </div>
        </div>

        {/* Leave Description */}
        {leaveReason === "Other" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-lg">
              Leave Description
            </label>
            <textarea
              value={leaveDescription}
              onChange={(e) => setLeaveDescription(e.target.value)}
              className="w-[200%] p-3 border rounded-md resize-none"
              rows="2"
              placeholder="Enter a description of your leave"
            ></textarea>
          </div>
        )}

        <button
          type="submit"
          className="w-52 bg-blue-500 text-white p-3 rounded-md text-lg font-bold"
        >
          Submit Leave
        </button>
      </form>

      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[70%] overflow-x-auto">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold mb-4 text-blue-800">
                Leave Details
              </h3>
              <h3
                className="text-xl font-bold mb-4 text-red-500 cursor-pointer"
                onClick={handlePopupClose}
              >
                X
              </h3>
            </div>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left">
                    Field
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Leave Type</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.leaveType}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">From Date</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.fromDate}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">To Date</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.toDate}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Leave Reason</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.leaveReason}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Description</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.leaveDescription}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Total Days</td>
                  <td className="border border-gray-300 p-2">
                    {leaveDetails.totalDays}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex gap-5">
              <button
                onClick={handlePopupClose}
                className="mt-4 bg-red-500 text-white p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={checkLeave}
                className="mt-4 bg-green-500 text-white p-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isLOP && (
        <LeaveNotification
          casualLeaveDays={
            leaveType === "Casual Leave"
              ? summary.CL
              : leaveType === "privilege Leave"
              ? summary.PL
              : summary.Paternity
          }
          lopDays={summary.LOP}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default Leaveform;
