import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ConfirmPermission from "./ConfrimPermission";
import duration from "dayjs/plugin/duration";
import { render } from "@react-email/render";
import PermissionEmailTemplate from "./PermissionTemplate";


dayjs.extend(duration);

const PermissionForm = () => {
  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken.empId);

  const [fromTime, setFromTime] = useState(
    dayjs().isBetween(
      dayjs().startOf("day").hour(9),
      dayjs().startOf("day").hour(17)
    )
      ? dayjs()
      : dayjs().hour(9)
  );
  const [toTime, setToTime] = useState(dayjs().add(1, "hour"));
  const [permissionDate, setPermissionDate] = useState("");
  const [permissionReason, setPermissionReason] = useState("");
  const [isPermission, setIsPermission] = useState(false);

  const isTimeExceeding = () => {
    const timeDifference = dayjs.duration(toTime.diff(fromTime)).asHours();
    console.log("time Difference", timeDifference);
    return timeDifference > 2;
  };

  // Handle fromTime change
  const handleFromTimeChange = (newTime) => {
    const minTime = dayjs().startOf("day").hour(9);
    const maxTime = dayjs().startOf("day").hour(17);

    // Restrict fromTime to be between 9 AM and 5 PM
    if (newTime.isBefore(minTime)) {
      setFromTime(minTime);
    } else if (newTime.isAfter(maxTime)) {
      setFromTime(maxTime);
    } else {
      setFromTime(newTime);
    }
  };

  // Update toTime when fromTime changes
  useEffect(() => {
    const minToTime = fromTime.add(1, "hour");
    const maxToTime = fromTime.add(2, "hours");

    if (toTime.isBefore(minToTime)) {
      setToTime(minToTime);
    } else if (toTime.isAfter(maxToTime)) {
      setToTime(maxToTime);
    }
  }, [fromTime]);

  const applyPermission = async (e) => {
    console.log("permission");
    try {
      if (isTimeExceeding()) {
        toast.error("Time limit Exceeded");
      } else {
        console.log(
          "Permession Sendttttt",
          typeof dayjs.duration(toTime.diff(fromTime)).asHours()
        );
        const res = await axios.post(
          "http://localhost:5000/permission/apply",
          {
            empId: decodedToken.empId,
            hrs: dayjs.duration(toTime.diff(fromTime)).asHours().toFixed(1),
            reason: permissionReason,
            date: permissionDate,
            from: fromTime.format("hh:mm A"),
            to: toTime.format("hh:mm A"),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 201) {
          toast.success("Requested Permission Successfully");
          var data = res.data;
          console.log("data", data.permission._id);
          sendPermissionEmail(data.permission._id)
          // sendPermissionEmail(data.permission._id);
        } else if (res.status === 203) {
          toast.error("Insufficient Permission Balance");
        }
      }
    } catch (error) {
      console.error("Error permission Apply", error);
      toast.error("Error is requesting Permission");
    } finally {
      console.log("per end");
      setIsPermission(!isPermission);
    }
  };

  const checkPermission = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/permission/checkPermission",
        {
          empId: decodedToken.empId,
          date: permissionDate,
          hrs: dayjs.duration(toTime.diff(fromTime)).asHours(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);

      if (res.status === 202) {
        toast.error("The Permission Time is Already Applied");
      } else if (res.status === 203) {
        toast.warning("The Permission Time is Already Applied");
      } else {
        console.log("in else");
        setIsPermission(!isPermission);
      }
    } catch (e) {
      toast.error("Somthing went wrong");
    }
  };


  const sendPermissionEmail = async (objId) => {
    const emailContent = await render(
      <PermissionEmailTemplate
        date={permissionDate}
        fromTime={fromTime.format("hh:mm A")}
        toTime={toTime.format("hh:mm A")}
        permissionReason={permissionReason}
        userName={decodedToken.empName}
        imageUrl="https://www.gilbarco.com/us/sites/gilbarco.com.us/files/2022-07/gilbarco_logo.png"  
        permissionId={objId}
      />
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/mail/send",
        {
          email: decodedToken.managerMail,
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
        alert("Thank you");
      } else {
        toast.error("error in sending mail");
      }
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
      toast.error("error in sending mail");
    }
  };
 

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div className="w-[60%] h-fit shadow-xl p-10 flex flex-col gap-6 bg-gradient-to-l from-[#DAF0FF] to-white ">
        <h1 className="text-2xl text-center font-bold w-full mb-5">
          Permission Form
        </h1>
        <div className="w-[50%]">
          <label className="block text-gray-700 mb-1">Permission Date</label>
          <DatePicker
            selected={permissionDate}
            onChange={(date) => {
              setPermissionDate(formatDate(date));
            }}
            minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            filterDate={(date) => {
              const today = new Date();
              const dayOfWeek = today.getDay();

              // Allow today and tomorrow
              const isToday = date.toDateString() === today.toDateString();
              const isTomorrow =
                date.toDateString() ===
                new Date(today.setDate(today.getDate() + 1)).toDateString();

              // If today is Friday, allow Monday (two days after tomorrow)
              const isMonday =
                dayOfWeek === 5 &&
                date.toDateString() ===
                  new Date(today.setDate(today.getDate() + 2)).toDateString();

              // Disable weekends (Saturday and Sunday)
              const day = date.getDay();
              const isWeekend = day === 0 || day === 6;

              return !isWeekend && (isToday || isTomorrow || isMonday);
            }}
            className={`w-[150%] border  rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500 -z-2`}
            dateFormat="dd/MM/yyyy" // Change the format as per your requirement
            placeholderText="Select Permission Date"
            // Use the formatDate function to display the formatted value
            value={permissionDate}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex w-full gap-10">
            <MobileTimePicker
              label="From Time"
              value={fromTime}
              onChange={(newValue) => setFromTime(newValue)}
              minTime={dayjs().set("hour", 9).set("minute", 0)}
              maxTime={dayjs().set("hour", 17).set("minute", 0)}
              renderInput={(params) => <TextField {...params} />}
            />
            <MobileTimePicker
              label="To Time"
              value={toTime}
              minTime={fromTime.add(1, "hour")}
              maxTime={fromTime.add(2, "hour")}
              onChange={(newValue) => {
                setToTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>

        <textarea
          className="resize-none border-2 w-[80%] "
          rows={3}
          onChange={(e) => setPermissionReason(e.target.value)}
        />

        <button
          className="p-5 bg-blue-500 rounded-lg w-72 "
          onClick={checkPermission}
        >
          Submit
        </button>
        {isPermission && (
          <ConfirmPermission
            hours={dayjs.duration(toTime.diff(fromTime)).asHours().toFixed(2)}
            reason={permissionReason}
            fromTime={fromTime.format("hh:mm A")}
            toTime={toTime.format("hh:mm A")}
            permissionDate={permissionDate}
            employeeName={decodedToken.empName}
            onClose={setIsPermission}
            applyPermission={applyPermission}
          />
        )}
      </div>
    </>
  );
};

export default PermissionForm;