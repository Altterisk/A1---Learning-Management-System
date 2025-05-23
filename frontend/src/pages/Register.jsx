import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import useFormValidation from '../hooks/useFormValidation';

const Register = () => {
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) {
      tempErrors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      tempErrors.lastName = "Last Name is required";
    }

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    return tempErrors;
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit } = useFormValidation({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', }, validate);

  const onSubmit = async (e) => {
    try {
      await axiosInstance.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: "Admin",
      });
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
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
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {errors.firstName && <p className="text-red-600 mb-2">{errors.firstName}</p>}
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
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {errors.lastName && <p className="text-red-600 mb-2">{errors.lastName}</p>}
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.email && <p className="text-red-600 mb-2">{errors.email}</p>}
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.password && <p className="text-red-600 mb-2">{errors.password}</p>}
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mb-4 p-2 border rounded"
        />
        {errors.confirmPassword && <p className="text-red-600 mb-2">{errors.confirmPassword}</p>}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
