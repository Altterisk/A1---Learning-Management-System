import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MemberList = ({ members, setMembers }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  
  const filteredMembers = members.filter((member) => {
    if (filter === 'all') return true; // Show all members
    return member.role === filter; // Show only Teachers or Students
  });

  const handleDelete = async (memberId) => {
    try {
      await axiosInstance.delete(`/api/Members/${memberId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMembers(members.filter((member) => member._id !== memberId));
    } catch (error) {
      alert('Failed to delete Member.');
      console.log(error)
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/members/create')}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Member
        </button>
      </div>
      {members.length === 0 ? (
        <p className="text-gray-500">No members found. Click "Create New Member" to add one.</p>
      ) : (
        <div>
          <div className="mb-4">
            <span className="mr-4 font-medium text-gray-700">Filter by:</span>
            <label className="mr-4">
              <input
                type="radio"
                value="all"
                checked={filter === 'all'}
                onChange={() => setFilter('all')}
                className="mr-2"
              />
              All
            </label>
            <label className="mr-4">
              <input
                type="radio"
                value="Teacher"
                checked={filter === 'Teacher'}
                onChange={() => setFilter('Teacher')}
                className="mr-2"
              />
              Teachers
            </label>
            <label>
              <input
                type="radio"
                value="Student"
                checked={filter === 'Student'}
                onChange={() => setFilter('Student')}
                className="mr-2"
              />
              Students
            </label>
          </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-200">Name</th>
                <th className="px-4 py-2 border border-gray-200">Role</th>
                <th className="px-4 py-2 border border-gray-200">Date of Birth</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{member.name}</td>
                  <td className="px-4 py-2 border border-gray-200">{member.role}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {new Date(member.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <button
                      onClick={() => navigate(`/members/edit/${member._id}`)}
                      className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberList;
