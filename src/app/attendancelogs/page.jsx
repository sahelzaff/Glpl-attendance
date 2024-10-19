'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function AttendanceLogs() {
  const [employeeId, setEmployeeId] = useState('');
  const [searchEmployeeId, setSearchEmployeeId] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const queryClient = useQueryClient();

  const { data: logsData, isLoading, error } = useQuery({
    queryKey: ['attendanceLogs', searchEmployeeId],
    queryFn: () => axios.get(`http://localhost:3001/api/attendancelogs?EmployeeId=${searchEmployeeId}`).then(res => res.data),
    enabled: !!searchEmployeeId,
    onError: (error) => {
      console.error('Error fetching attendance logs:', error);
      toast.error(`Error fetching attendance logs: ${error.response?.data?.error || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedEntry) => axios.put(`http://localhost:3001/api/attendancelogs/${updatedEntry.AttendanceLogId}`, updatedEntry),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendanceLogs', searchEmployeeId]);
      setEditingEntry(null);
      toast.success('Entry updated successfully');
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!employeeId) {
      toast.error('Please enter an Employee ID');
      return;
    }
    setSearchEmployeeId(employeeId);
  };

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedFields = {};
    Object.keys(editingEntry).forEach(key => {
      if (editingEntry[key] !== logsData.find(log => log.AttendanceLogId === editingEntry.AttendanceLogId)[key]) {
        updatedFields[key] = editingEntry[key];
      }
    });
    updateMutation.mutate({ AttendanceLogId: editingEntry.AttendanceLogId, ...updatedFields });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Attendance Logs</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error.message}</p>}

      {logsData && logsData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Attendance Log ID</th>
                <th className="border p-2">Attendance Date</th>
                <th className="border p-2">In Time</th>
                <th className="border p-2">Out Time</th>
                <th className="border p-2">Duration</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {logsData.map((log) => (
                <tr key={log.AttendanceLogId}>
                  <td className="border p-2">{log.AttendanceLogId}</td>
                  <td className="border p-2">{new Date(log.AttendanceDate).toLocaleDateString()}</td>
                  <td className="border p-2">{log.InTime}</td>
                  <td className="border p-2">{log.OutTime}</td>
                  <td className="border p-2">{log.Duration}</td>
                  <td className="border p-2">{log.Status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logsData && logsData.length === 0 && (
        <p>No attendance logs found for the entered Employee ID.</p>
      )}

      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Attendance Log</h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editingEntry).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">{key}</label>
                    <input
                      type="text"
                      value={value === null ? '' : value}
                      onChange={(e) => setEditingEntry({...editingEntry, [key]: e.target.value === '' ? null : e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-4 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
