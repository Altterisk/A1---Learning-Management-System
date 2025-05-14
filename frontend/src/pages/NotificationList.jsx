import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const NotificationList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/auth/notifications', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch('/api/auth/notifications/read', {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`border rounded p-4 shadow-sm ${
                n.read
                  ? 'bg-white text-gray-600'
                  : 'bg-yellow-100 border-yellow-400 text-black font-semibold'
              }`}
            >
              <div>{n.message}</div>
              <div className="text-sm text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
