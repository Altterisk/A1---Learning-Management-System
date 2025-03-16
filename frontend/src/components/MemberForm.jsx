import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const MemberForm = ({ editingMember }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', role: 'Teacher', dateOfBirth: '' });

  useEffect(() => {
    if (editingMember) {
      console.log(editingMember)
      const formattedDate = editingMember.dateOfBirth ? new Date(editingMember.dateOfBirth).toISOString().split('T')[0] : '';
      setFormData({
        name: editingMember.name,
        role: editingMember.role,
        dateOfBirth: formattedDate,
      });
    } else {
      setFormData({ name: '', role: 'Teacher', dateOfBirth: '' });
    }
  }, [editingMember]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await axiosInstance.put(`/api/members/${editingMember._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Member updated successfully!');
      } else {
        await axiosInstance.post('/api/members', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Member created successfully!');
      }
      navigate('/members/list');
    } catch (error) {
      alert('Failed to save Member.');
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingMember ? 'Member Edit' : 'Member Creation'}</h1>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
        Role
      </label>
      <select
        id="role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="Teacher">Teacher</option>
        <option value="Student">Student</option>
      </select>
      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        id="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingMember ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default MemberForm;
