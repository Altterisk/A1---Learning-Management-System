import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserCard = ({ user, onDelete }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === 'Admin';
  const isTargetAdmin = user.role === 'Admin';

  return (
    <div className="border rounded-xl shadow-sm p-4 mb-4 bg-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold mb-2">{`${user.firstName} ${user.lastName}`}</h2>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Role:</span> {user.role}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Date of Birth:</span>{' '}
          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
        </p>
        {user.role === 'Teacher' && (
          <p className="text-sm text-gray-700 font-medium">
            <span className="font-semibold text-gray-900">Description:</span>{' '}
            {user.description || 'N/A'}
          </p>
        )}

        {user.role === 'Student' && (
          <p className="text-sm text-gray-700 font-medium">
            <span className="font-semibold text-gray-900">Major:</span>{' '}
            {user.major || 'N/A'}
          </p>
        )}
      </div>

      {isAdmin && !isTargetAdmin && (
        <div className="flex space-x-2 mt-4 justify-end">
          <button
            onClick={() => navigate(`/users/edit/${user._id}`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(user._id)}
            className="bg-red-500 text-white px-3 py-1 rounded font-semibold"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
