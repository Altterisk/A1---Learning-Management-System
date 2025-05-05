import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const UserList = ({ users, setUsers }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  
  const filteredUsers = users.filter((user) => {
    if (filter === 'all') return true; // Show all users
    return user.role === filter; // Show only Teachers or Students
  });

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this user? This cannot be undo!');
    if (!isConfirmed) return;
    try {
      await axiosInstance.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert('Failed to delete User.');
      console.log(error)
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/users/create')}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New User
        </button>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found. Click "Create New User" to add one.</p>
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{user.name}</td>
                  <td className="px-4 py-2 border border-gray-200">{user.role}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    <button
                      onClick={() => navigate(`/users/edit/${user._id}`)}
                      className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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

export default UserList;
