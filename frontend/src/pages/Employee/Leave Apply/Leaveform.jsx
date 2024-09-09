import React, { useState } from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { render } from "@react-email/render";
import "react-toastify/dist/ReactToastify.css";
import LeaveNotification from "./LeaveNotification";
import EmailTemplate from "./EmailTemplate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Leaveform = () => {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState(null);
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

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "";
  };

  const today = dayjs();
  const maxDate = today.add(1, "month").endOf("month");

  const shouldDisableDate = (date) => {
    return date.day() === 0 || date.day() === 6; 
  };

  const shouldDisableToDate = (date) => {
    if (!fromDate) return false;
    return (
      date.day() === 0 || date.day() === 6 || date.month() !== fromDate.month()
    );
  };

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
        `${process.env.REACT_APP_BASE_URL}/leave/checkLeave`,
        {
          empId: decodedToken.empId,
          role: decodedToken.role,
          leaveType: leaveType,
          from: {
            date: formatDate(fromDate),
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

    // Convert Day.js objects to native JavaScript Date objects
    const fromDateObj = dayjs(fromDate).toDate();
    const toDateObj = dayjs(toDate).toDate();

    // Calculate time difference
    const diffInTime = toDateObj.getTime() - fromDateObj.getTime();
    const totalDays = diffInTime / (1000 * 3600 * 24) + 1;

    let adjustedDays = totalDays;

    if (isHalfDayFrom) adjustedDays -= 0.5;
    if (isHalfDayTo) adjustedDays -= 0.5;

    return adjustedDays;
  };

  const handleConfirm = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/apply`,
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
          LOP:summary.LOP,
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
        setIsLOP(!isLOP);
        setPopupVisible(!popupVisible);
        toast.success("Leave Appliled Successfully");
        console.log(res.data.leave._id);
        sendLeaveEmail(res.data.leave._id, "false");
      } else {
        toast.error("Error in requesting Leave");
      }

      var data = res.data;
      console.log(data.leave._id);

      // sendLeaveEmail(data.leave._id, "True");

      console.log("data", res.data);
    } catch (error) {
      console.error("Error Leave Apply", error);
      toast.error("Error in Applying Leave");
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
        fromDate={formatDate(fromDate)}
        toDate={formatDate(toDate)}
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
        `${process.env.REACT_APP_BASE_URL}/mail/send`,
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
        toast.success("Mail sent Successfully");
        setTimeout(() => {
          navigate("/thank-you");
        }, 3000);
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

  var totalDays = calculateLeaveDays();

  const handleSubmit = (e) => {
    e.preventDefault();

    const halfDayInfo = {
      fromHalf: isHalfDayFrom ? fromHalf : "Full Day",
      toHalf: isHalfDayTo ? toHalf : "Full Day",
    };

    setLeaveDetails({
      fromDate: fromDate ? formatDate(fromDate) : "",
      toDate: toDate ? formatDate(toDate) : "",
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

  return (
    <div className="w-[70%] md:w-[50%] py-8  border-2 rounded-lg bg-gradient-to-l from-[#DAF0FF] to-white shadow-xl flex flex-col justify-center items-center">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-4 text-center text-blue-800">
        Apply for Leave
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center items-center w-full px-4"
      >
        {/* Leave Type */}
        <div className="w-full mb-4">
          <label className="block text-gray-700 mb-2 text-xl font-bold">
            Leave Type
          </label>
          <div className="flex gap-4 flex-wrap">
            {["Casual Leave", "Privilege Leave", "Paternity Leave"].map(
              (type) => (
                <label key={type} className="flex items-center text-lg">
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
        <div className="w-full mb-4 flex flex-wrap gap-4 items-center  ">
          <div className="w-[30%]">
            <label className="block text-gray-700 mb-1 font-bold">
              From Date
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={fromDate}
                onChange={(newValue) => {
                  setFromDate(newValue);
                  setToDate(newValue); // Sync 'toDate' with 'fromDate'
                }}
                shouldDisableDate={shouldDisableDate}
                minDate={today}
                maxDate={maxDate}
                renderInput={(params) => (
                  <input
                    {...params.inputProps}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                    placeholder="Select From Date"
                  />
                )}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>

          {/* Half/Full Day From */}
          <div className="flex gap-4 mt-7">
            <button
              type="button"
              onClick={() => handleFromDayTypeChange("full")}
              className={`p-2 rounded-md ${
                !isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Full Day
            </button>
            <button
              type="button"
              onClick={() => handleFromDayTypeChange("half")}
              className={`p-2 rounded-md ${
                isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Half Day
            </button>
          </div>

          {/* First/Second Half From */}
          {isHalfDayFrom && (
            <div className="flex gap-4 mt-8 text-lg">
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

        {/* To Date */}
        <div className="w-full mb-4 flex flex-wrap gap-4 items-center">
          <div className="w-[30%]">
            <label className="block text-gray-700 mb-1">To Date</label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                shouldDisableDate={shouldDisableToDate}
                minDate={fromDate || today}
                maxDate={maxDate}
                renderInput={(params) => (
                  <input
                    {...params.inputProps}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                    placeholder="Select To Date"
                  />
                )}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>

          {/* Half/Full Day To */}
          <div className="flex gap-4 mt-7">
            <button
              type="button"
              onClick={() => handleToDayTypeChange("full")}
              className={`p-2 rounded-md ${
                !isHalfDayTo ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Full Day
            </button>
            <button
              type="button"
              onClick={() => handleToDayTypeChange("half")}
              className={`p-2 rounded-md ${
                isHalfDayTo ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Half Day
            </button>
          </div>

          {/* First/Second Half To */}
          {isHalfDayTo && (
            <div className="flex gap-4 mt-8 text-lg">
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

        {/* Leave Reason */}
        <div className="w-full mb-4">
          <label className="block text-gray-700 mb-2 text-lg">
            Leave Reason
          </label>
          <div className="flex gap-4 flex-wrap text-lg">
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
          <div className="w-full flex items-center mb-3">
            <label className="block text-gray-700 mb-2 text-lg mr-5">
              Leave Description
            </label>
            <textarea
              value={leaveDescription}
              onChange={(e) => setLeaveDescription(e.target.value)}
              className="w-[50%] p-3 border rounded-md resize-none"
              rows="2"
              placeholder="Enter a description of your leave"
            ></textarea>
          </div>
        )}

        <button
          type="submit"
          className="w-52 bg-blue-500 text-white p-3 rounded-md text-lg font-bold shadow-lg"
        >
          Submit Leave
        </button>
      </form>

      {/* Popup for Leave Details */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] flex flex-col justify-center overflow-x-auto">
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
            <div className="w-full flex justify-center items-center">
              <table className="w-[90%] border-collapse text-lg border border-gray-300">
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
                  {/* Display Leave Details */}
                  <tr>
                    <td className="border  border-gray-300 p-2">Leave Type</td>
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
                    <td className="border border-gray-300 p-2">
                      Number of Days
                    </td>
                    <td className="border border-gray-300 p-2">
                      {leaveDetails.totalDays}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">Leave Reason</td>
                    <td className="border border-gray-300 p-2">
                      {leaveDetails.leaveReason}
                    </td>
                  </tr>
                  {leaveDetails.leaveDescription && (
                    <tr>
                      <td className="border border-gray-300 p-2">
                        Leave Description
                      </td>
                      <td className="border border-gray-300 p-2">
                        {leaveDetails.leaveDescription}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-5 flex justify-center items-center">
              <button
                className="bg-green-500  w-[100px] rounded-md h-[40px]"
                onClick={checkLeave}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isLOP && (
        <LeaveNotification
          totalLeaveDays={totalDays}
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
