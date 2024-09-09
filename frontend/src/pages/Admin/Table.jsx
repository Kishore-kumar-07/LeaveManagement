import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { MdMessage, MdClose, MdEdit } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Table = () => {
  const headers = [
    "S.No",
    "Name",
    "Employee-Type",
    "Leave-Type",
    "From",
    "To",
    "Days",
    "Reason",
    "Action",
    "Edit",
  ];

  const [isActionPopupOpen, setActionPopupOpen] = useState(false);
  const [isReasonPopupOpen, setReasonPopupOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState({});
  const [editRowId, setEditRowId] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);

  const rowsPerPage = 6;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    getData();
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAccept = async () => {
    if (selectedLeaveId === null) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/updateLeave`,
        {
          empId: empId,
          leaveId: selectedLeaveId,
          status: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Leave request approved successfully!");
        // setLeaveStatus((prevStatus) => ({
        //   ...prevStatus,
        //   [selectedLeaveId]: 'Approved',
        // }));
      } else {
        toast.error("Failed to approve leave request.");
      }

      getData();
    } catch (error) {
      console.error("Error accepting leave:", error);
      toast.error("Failed to send request");
    }

    setActionPopupOpen(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/updateLeave`,
        {
          empId: empId,
          leaveId: selectedLeaveId,
          status: "Denied",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Leave request declined successfully!");
        setLeaveStatus((prevStatus) => ({
          ...prevStatus,
          [selectedLeaveId]: "Rejected",
        }));
      } else {
        toast.error("Failed to decline leave request.");
      }

      getData();
      setReasonPopupOpen(false);
      setActionPopupOpen(false);
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Failed to send request");
    }
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setReasonPopupOpen(true);
  };

  const handleEditClick = (rowId) => {
    setSelectedLeaveId(rowId);
    setActionPopupOpen(true);
    setIsRejecting(false);
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
    setActionPopupOpen(false);
    setRejectionReason("");
  };

  const handleRejectClick = () => {
    setIsRejecting(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredData = response.data;
      setData(filteredData);
      // Initialize leaveStatus with data
      const statusMap = filteredData.reduce((acc, item) => {
        acc[item._id] = "Pending";
        return acc;
      }, {});
      setLeaveStatus(statusMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const dataToDisplay = data.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-slate-100 p-3 border-slate-950 rounded-lg">
      <ToastContainer />
      <div className="w-full overflow-x-auto">
        <table className=" divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-3 text-left font-bold text-sm text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataToDisplay.map((row, rowIndex) => (
              <tr key={rowIndex + 1}>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {rowIndex + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.empName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.role}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.leaveType}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.from.date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.to.date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.numberOfDays}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-2xl font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleReasonClick(row.reason)}
                >
                  <MdMessage />
                </td>
                <td
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex flex-row gap-4 ${
                    row.status === "Approved"
                      ? "bg-green-200"
                      : row.status === "Denied"
                      ? "bg-red-200"
                      : "bg-yellow-200"
                  }`}
                >
                  <span className="ml-2 text-lg font-bold text-gray-900">
                    {row.status}
                  </span>
                </td>
                <td className=" whitespace-nowrap text-sm font-medium text-gray-900 pl-5">
                  <button
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={() => handleEditClick(row._id)}
                  >
                    <MdEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Popup for actions */}
      {isActionPopupOpen && (
        <ActionPopup
          isOpen={isActionPopupOpen}
          onClose={handleCancelEdit}
          onAccept={handleAccept}
          onReject={handleRejectClick}
          isRejecting={isRejecting}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onSubmitReject={handleReject}
        />
      )}

      {/* Popup for displaying reason */}
      {isReasonPopupOpen && (
        <Popup
          isOpen={isReasonPopupOpen}
          onClose={() => setReasonPopupOpen(false)}
          content={selectedReason}
        />
      )}
    </div>
  );
};

const ActionPopup = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
  isRejecting,
  rejectionReason,
  setRejectionReason,
  onSubmitReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Please review the leave request and select an option to confirm your
            decision
          </h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>

        {!isRejecting ? (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onReject}
            >
              Reject
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <textarea
              className="w-full   border border-gray-300 p-2 rounded-md mb-4"
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={onSubmitReject}
            >
              Submit
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Popup = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reason</h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default Table;
