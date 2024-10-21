'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function AttenInfo() {
  const [ticketNo, setTicketNo] = useState('');
  const [searchTicketNo, setSearchTicketNo] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const queryClient = useQueryClient();

  const { data: attenInfoData, isLoading, error } = useQuery({
    queryKey: ['attenInfo', searchTicketNo],
    queryFn: () => axios.get(`http://192.168.45.129:5000/api/atteninfo?ticketNo=${searchTicketNo}`).then(res => res.data),
    enabled: !!searchTicketNo,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedEntry) => axios.put(`http://192.168.45.129:5000/api/atteninfo/${updatedEntry.srno}`, updatedEntry),
    onSuccess: () => {
      queryClient.invalidateQueries(['attenInfo', searchTicketNo]);
      setEditingEntry(null);
      toast.success('Entry updated successfully');
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTicketNo(ticketNo);
  };

  const handleEdit = (entry) => {
    setEditingEntry({ ...entry });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(editingEntry);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Attendance Information</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={ticketNo}
          onChange={(e) => setTicketNo(e.target.value)}
          placeholder="Enter Ticket Number"
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

      {attenInfoData && attenInfoData.length > 0 && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Srno</th>
              <th className="border p-2">EmpCode</th>
              <th className="border p-2">TicketNo</th>
              <th className="border p-2">EntryDate</th>
              <th className="border p-2">InoutFlag</th>
              <th className="border p-2">trfFlag</th>
              <th className="border p-2">UpdateUID</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">ErrMsg</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {attenInfoData.map((entry) => (
              <tr key={entry.srno}>
                <td className="border p-2">{entry.srno}</td>
                <td className="border p-2">{entry.EmpCode}</td>
                <td className="border p-2">{entry.TicketNo}</td>
                <td className="border p-2">{entry.EntryDate}</td>
                <td className="border p-2">{entry.InoutFlag}</td>
                <td className="border p-2">{entry.trfFlag}</td>
                <td className="border p-2">{entry.UpdateUID}</td>
                <td className="border p-2">{entry.Location}</td>
                <td className="border p-2">{entry.ErrMsg}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[800px]">
            <h2 className="text-2xl font-bold mb-4">Edit Entry</h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editingEntry).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setEditingEntry({...editingEntry, [key]: e.target.value})}
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
