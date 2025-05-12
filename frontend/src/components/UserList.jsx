import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserCard from './Cards/UserCard';

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
      {(user.role === 'Admin') && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/users/create')}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Create New User
          </button>
        </div>
      )}
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredUsers.map((u) => (
              <UserCard key={u._id} user={u} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
