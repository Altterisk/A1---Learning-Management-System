import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import useFormValidation from '../hooks/useFormValidation';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
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

    return tempErrors;
  };

  const { formData, errors, handleChange, handleBlur, handleSubmit } = useFormValidation(
    { email: '', password: '' },
    validate
  );

  const onSubmit = async (e) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { ...formData, role: "Admin" });
      login(response.data);
      navigate('/users/list');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="md:w-1/2 w-full h-64 md:h-auto relative">
        <img
          src="/images/LoginVisual.jpeg"
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 md:hidden">
          <h1 className="text-4xl font-bold text-white text-center px-4">
            Login to start our learning journey
          </h1>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex flex-col items-center justify-center p-6 space-y-6">
        <div className="md:block hidden text-center text-4xl font-bold text-gray-800 mb-10">
          Login to start our learning journey
        </div>
        <form
          onSubmit={(e) => handleSubmit(e, onSubmit)}
          className="w-full max-w-md bg-white p-6 shadow-md rounded"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <h1 className="text-sm font-light text-neutral-500 mb-4 text-center">Enter your email and password to login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full mb-4 p-2 border rounded"
          />
          {errors.email && <p className="text-red-600 text-sm mb-2">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full mb-4 p-2 border rounded"
          />
          {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-800 text-white p-2 hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
