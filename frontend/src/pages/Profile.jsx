import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import useFormValidation from '../hooks/useFormValidation';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateData } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) {
      tempErrors.firstName = 'First Name is required';
    }
    if (!formData.lastName) {
      tempErrors.lastName = 'Last Name is required';
    }
    return tempErrors;
  };

  const { formData, errors, setFormData, handleChange, handleBlur, handleSubmit } = useFormValidation(
    {
      firstName: '',
      lastName: '',
    },
    validate
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
    });
  }, [user, setFormData]);

  const onSubmit = async () => {
    try {
      const response = await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      updateData(response.data)
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>

        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.firstName && <p className="text-red-600 mb-2">{errors.firstName}</p>}

        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.lastName && <p className="text-red-600 mb-2">{errors.lastName}</p>}
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

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded my-2">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/changePassword')}
          className="w-full bg-gray-600 text-white p-2 rounded my-2"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Profile;