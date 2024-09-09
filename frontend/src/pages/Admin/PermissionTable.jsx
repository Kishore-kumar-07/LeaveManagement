import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { MdMessage, MdClose, MdEdit } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { IoMdSearch } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";

import "react-toastify/dist/ReactToastify.css";

const PermissionTable = () => {
  const headers = [
    "S.No",
    "Name",
    "Employee-Type",
    "Type",
    "From",
    "To",
    "Hours",
    "Reason",
    "Status",
    "Action",
  ];

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const rowsPerPage = 6; // Adjust as needed
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const statusOptions = ["All", "Approved", "Pending", "Denied"];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (id, status) => {
    try {
      console.log(status);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/updatePermission`,
        {
          empId: empId,
          permissionId: id,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Leave request ${status.toLowerCase()} successfully!`);
        getData();
      } else {
        toast.error(`Failed to ${status.toLowerCase()} leave request.`);
      }
    } catch (error) {
      console.error(`Error updating leave status:`, error);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditPopupOpen(true);
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setPopupOpen(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
        {
          empId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredData = response.data;
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter((row) => row.empName.toLowerCase().startsWith(query))
      );
    }
    setCurrentPage(1); // Reset to first page after filtering
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const dataToDisplay = filteredData.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-slate-100 p-3 border-slate-950 rounded-lg">
      <ToastContainer />

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-bold text-sm text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataToDisplay.map((row, rowIndex) => (
              <tr key={rowIndex + 1}>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {startIndex + rowIndex + 1}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {row.empName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {row.role}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  Permission
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {row.from}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {row.to}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-md font-medium text-gray-900">
                  {row.hrs < 1
                    ? `${(row.hrs * 60).toFixed(2)} mins`
                    : `${row.hrs.toFixed(2)} hrs`}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap text-2xl font-medium text-gray-900 cursor-pointer"
                  onClick={() => handleReasonClick(row.reason)}
                >
                  <MdMessage />
                </td>
                <td
                  className={`px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 gap-4 ${
                    row.status === "Approved"
                      ? "bg-green-200"
                      : row.status === "Denied"
                      ? "bg-red-200"
                      : "bg-yellow-200"
                  }`}
                >
                  {row.status}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900  gap-4">
                  <button
                    className="text-black-500 hover:text-black-700 text-2xl"
                    onClick={() => handleEditClick(row)}
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
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        content={selectedReason}
      />
      <EditPopup
        isOpen={editPopupOpen}
        onClose={() => setEditPopupOpen(false)}
        row={selectedRow}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

const Popup = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Popup Content */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Details</h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <div className="text-black">{content}</div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditPopup = ({ isOpen, onClose, row, onStatusChange }) => {
  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Popup Content */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Permission</h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <div className="text-black">
          <p>Employee: {row.empName}</p>
          <p>Type: Permission</p>
          <p>From: {row.from}</p>
          <p>To: {row.to}</p>
          <p>
            Hours:{" "}
            {row.hrs < 1
              ? `${(row.hrs * 60).toFixed(2)} mins`
              : `${row.hrs.toFixed(2)} hrs`}
          </p>
          <p>Reason: {row.reason}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              onStatusChange(row._id, "Approved");
              onClose();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => {
              onStatusChange(row._id, "Denied");
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionTable;
