import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';

const UserForm = ({ editingUser }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if the user is not Admin
  useEffect(() => {
    if (user.role !== 'Admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First Name is required";
    if (!formData.lastName) tempErrors.lastName = "Last Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.role) tempErrors.role = "Role is required";
    return tempErrors;
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit, setFormData } =
    useFormValidation({ firstName: '', lastName: '', email: '', role: 'Teacher', dateOfBirth: '' }, validate);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        role: editingUser.role || "Teacher",
        dateOfBirth: editingUser.dateOfBirth
          ? new Date(editingUser.dateOfBirth).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
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
        alert(`User created successfully!\nThe default password is ${response.data.password}`);
      }
      navigate('/users/list');
    } catch (error) {
      alert('Failed to save User.');
      alert(error);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-6">{editingUser ? 'Edit User' : 'Create User'}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            name="firstName"
            className="w-full p-2 border rounded"
            required
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            name="lastName"
            className="w-full p-2 border rounded"
            required
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="mt-4">
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
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={handleChange}
          onBlur={handleBlur}
          name="role"
          className="w-full p-2 border rounded"
          required
        >
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
        {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
      </div>

      <div className="mt-4">
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
          className="w-full p-2 border rounded"
        />
        {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
          {editingUser ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
