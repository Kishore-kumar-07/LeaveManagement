import React from "react";

const ConfirmPermission = ({
  hours,
  reason,
  fromTime,
  toTime,
  permissionDate,
  employeeName,
  onClose,
  applyPermission,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] ">
        <div className="flex justify-between items-center pb-5">
          <h2 className="text-2xl font-semibold">Details</h2>
          <h2
            className="text-xl text-red-500 cursor-pointer font-bold"
            onClick={() => onClose()}
          >
            X
          </h2>
        </div>

        <table className="w-full border text-lg border-gray-300">
          <tbody>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                Employee Name:
              </td>
              <td className="border border-gray-300 py-2 px-4">
                {employeeName}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                Permission Date:
              </td>
              <td className="border border-gray-300 py-2 px-4">
                {permissionDate}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                From Time:
              </td>
              <td className="border border-gray-300 py-2 px-4">{fromTime}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                To Time:
              </td>
              <td className="border border-gray-300 py-2 px-4">{toTime}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                Hours:
              </td>
              <td className="border border-gray-300 py-2 px-4">{hours}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 py-2 px-4 font-semibold">
                Reason:
              </td>
              <td className="border border-gray-300 py-2 px-4">{reason}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => applyPermission()}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPermission;
