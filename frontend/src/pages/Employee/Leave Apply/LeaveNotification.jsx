import React from 'react';

const LeaveNotification = ({ totalLeaveDays, casualLeaveDays, lopDays, handleCancel, handleConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Leave Application Summary</h2>
        
        <table className="w-full text-left">
          <tbody>
            <tr>
              <td className="py-2">Total Leave Days:</td>
              <td className="py-2"><strong>{totalLeaveDays}</strong></td>
            </tr>
            <tr>
              <td className="py-2">Casual Leave (CL):</td>
              <td className="py-2"><strong>{casualLeaveDays}</strong></td>
            </tr>
            <tr>
              <td className="py-2">Loss of Pay (LOP):</td>
              <td className={`py-2 ${lopDays > 0 ? 'text-red-600' : ''}`}>
                {lopDays > 0 ? <strong>{lopDays}</strong> : 'None'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveNotification;
