import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-gray-300 p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl hover:underline text-orange-500 font-bold">Learning Management System</Link>
      <div>
        {loading ? null :
          user ? (
            <>
              <Link to="/users/list" className="hover:text-white hover:underline font-bold mr-4">Users</Link>
              <Link to="/courses/list" className="hover:text-white hover:underline font-bold mr-4">Courses</Link>
              <Link to="/profile" className="hover:text-white hover:underline font-bold mr-4">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:text-white font-bold px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white hover:underline font-bold mr-4">Login</Link>
              <Link
                to="/register"
                className="bg-green-500 hover:text-white font-bold px-4 py-2 rounded hover:bg-green-700"
              >
                Register
              </Link>
            </>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
