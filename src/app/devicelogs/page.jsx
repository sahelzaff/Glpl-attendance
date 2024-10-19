'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const fetchDeviceLogs = async ({ queryKey }) => {
  const [_, table, userId] = queryKey;
  if (!table || !userId) return [];
  const { data } = await axios.get('http://localhost:3001/api/devicelogs', { params: { table, userId } });
  return data;
};

const updateDeviceLog = async ({ id, table, ...updateData }) => {
  const { data } = await axios.put(`http://localhost:3001/api/devicelogs/${id}`, { table, ...updateData });
  return data;
};

export default function DeviceLogs() {
  const [userId, setUserId] = useState('');
  const [selectedTable, setSelectedTable] = useState('DeviceLogs_10_2024');
  const [editingLog, setEditingLog] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const queryClient = useQueryClient();

  const { data: logs = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['deviceLogs', selectedTable, userId],
    queryFn: fetchDeviceLogs,
    enabled: false, // Disable automatic fetching
  });

  const mutation = useMutation({
    mutationFn: updateDeviceLog,
    onSuccess: () => {
      queryClient.invalidateQueries(['deviceLogs', selectedTable, userId]);
      setEditingLog(null);
      toast.success('Device log updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating device log: ${error.message}`);
    },
  });

  const tableOptions = [
    'DeviceLogs_10_2024',
    'DeviceLogs_9_2024',
    'DeviceLogs_8_2024',
    'DeviceLogs_7_2024',
    'DeviceLogs_6_2024',
    'DeviceLogs_5_2024',
    'DeviceLogs_4_2024',
    'DeviceLogs_3_2024',
    'DeviceLogs_2_2024',
    'DeviceLogs_1_2024'
  ];

  const handleSearch = () => {
    if (!userId || !selectedTable) {
      toast.error('Please enter a User ID and select a table');
      return;
    }
    setShouldFetch(true);
    refetch();
  };

  const handleEdit = (log) => {
    setEditingLog({ ...log });
  };

  const handleSave = () => {
    const changedFields = {};
    Object.keys(editingLog).forEach(key => {
      if (editingLog[key] !== logs.find(log => log.DeviceLogId === editingLog.DeviceLogId)[key]) {
        changedFields[key] = editingLog[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected');
      return;
    }

    mutation.mutate({
      id: editingLog.DeviceLogId,
      table: selectedTable,
      ...changedFields
    });
  };

  const handleCancel = () => {
    setEditingLog(null);
  };

  const handleChange = (e, field) => {
    setEditingLog({ ...editingLog, [field]: e.target.value });
  };

  return (
    <div className="container mx-auto mt-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Device Logs</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="border p-2 rounded"
        />
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="border p-2 rounded"
        >
          {tableOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message}</div>}
      {shouldFetch && !isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">DeviceLogId</th>
                <th className="px-4 py-2">DownloadDate</th>
                <th className="px-4 py-2">DeviceId</th>
                <th className="px-4 py-2">UserId</th>
                <th className="px-4 py-2">LogDate</th>
                <th className="px-4 py-2">Direction</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.DeviceLogId}>
                  <td className="border px-4 py-2">{log.DeviceLogId}</td>
                  <td className="border px-4 py-2">{log.DownloadDate}</td>
                  <td className="border px-4 py-2">{log.DeviceId}</td>
                  <td className="border px-4 py-2">{log.UserId}</td>
                  <td className="border px-4 py-2">{log.LogDate}</td>
                  <td className="border px-4 py-2">{log.Direction}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
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
      {editingLog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Device Log</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(editingLog).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-bold mb-2">{key}</label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e, key)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
