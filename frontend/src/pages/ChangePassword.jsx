import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.currentPassword) tempErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) tempErrors.newPassword = 'New password is required';
    if (formData.newPassword !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await axiosInstance.put(
        '/api/auth/password',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      alert('Password changed successfully!');
      navigate('/profile');
    } catch (error) {
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Change Password</h1>

        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.currentPassword && <p className="text-red-600 mb-2">{errors.currentPassword}</p>}

        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.newPassword && <p className="text-red-600 mb-2">{errors.newPassword}</p>}

        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.confirmPassword && <p className="text-red-600 mb-2">{errors.confirmPassword}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded my-2">
          {loading ? 'Updating...' : 'Change Password'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-full bg-gray-600 text-white p-2 rounded my-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;