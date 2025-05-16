import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBell } from "react-icons/fa";

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
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
              <Link to="/users/list" className="hover:text-white hover:underline font-bold">Users</Link>
              <Link to="/courses/list" className="hover:text-white hover:underline font-bold">Courses</Link>
              <Link to="/profile" className="hover:text-white hover:underline font-bold">Profile</Link>
              <Link to="/notifications" className="relative text-white">
                <FaBell size={20} />
                {user.unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {user.unreadCount > 9 ? '9+' : user.unreadCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:text-white font-bold px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
              <Link to="/login" className="hover:text-white hover:underline font-bold">Login</Link>
            </div>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
