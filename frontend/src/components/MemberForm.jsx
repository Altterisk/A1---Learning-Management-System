import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';

const MemberForm = ({ editingMember }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Name is required";
    }
    if (!formData.role) {
      tempErrors.role = "Role is required";
    }

    return tempErrors;
  };
  
  const { formData, errors, handleChange, handleBlur, handleSubmit, setFormData } = useFormValidation({ name: '', role: 'Teacher', dateOfBirth: '' }, validate);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name || "",
        role: editingMember.role || "Teacher",
        dateOfBirth: editingMember.dateOfBirth ? new Date(editingMember.dateOfBirth).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: "",
        role: "Teacher",
        dateOfBirth: "",
      });
    }
  }, [editingMember, setFormData]);

  const onSubmit = async (e) => {
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
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingMember ? 'Member Edit' : 'Member Creation'}</h1>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        id="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        name="name"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.name && <p className="text-red-600 mb-2">{errors.name}</p>}
      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
        Role
      </label>
      <select
        id="role"
        value={formData.role}
        onChange={handleChange}
        onBlur={handleBlur}
        name="role"
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="Teacher">Teacher</option>
        <option value="Student">Student</option>
      </select>
      {errors.role && <p className="text-red-600 mb-2">{errors.role}</p>}
      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
        Date of Birth
      </label>
      <input
        type="date"
        id="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        onBlur={handleBlur}
        name="dateOfBirth"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.dateOfBirth && <p className="text-red-600 mb-2">{errors.dateOfBirth}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingMember ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default MemberForm;
