import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';

const UserForm = ({ editingUser }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) {
      tempErrors.name = "Name is required";
    }
    if (!formData.email) {
      tempErrors.email = "Email is required";
    }
    if (!formData.role) {
      tempErrors.role = "Role is required";
    }

    return tempErrors;
  };
  
  const { formData, errors, handleChange, handleBlur, handleSubmit, setFormData } = useFormValidation({ name: '', role: 'Teacher', dateOfBirth: '' }, validate);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        email: editingUser.email || "",
        role: editingUser.role || "Teacher",
        dateOfBirth: editingUser.dateOfBirth ? new Date(editingUser.dateOfBirth).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        name: "",
        role: "Teacher",
        dateOfBirth: "",
      });
    }
  }, [editingUser, setFormData]);

  const onSubmit = async (e) => {
    try {
      if (editingUser) {
        await axiosInstance.put(`/api/users/${editingUser._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('User updated successfully!');
      } else {
        const response = await axiosInstance.post('/api/users', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert(`User created successfully!\nThe default password is ${response.password}`);
      }
      navigate('/users/list');
    } catch (error) {
      alert('Failed to save User.');
      alert(error);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingUser ? 'User Edit' : 'User Creation'}</h1>
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
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        name="email"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.email && <p className="text-red-600 mb-2">{errors.email}</p>}
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
        {editingUser ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default UserForm;
