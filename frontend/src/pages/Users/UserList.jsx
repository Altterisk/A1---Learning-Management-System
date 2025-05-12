import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import Loading from '../../components/Loading';
import UserList from '../../components/UserList';
import { useAuth } from '../../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        console.log(user);
        const response = await axiosInstance.get('/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch Users.');
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {!started && <Loading/>}
      {started && loading && <Loading/>}
      {started && !loading && <UserList users={users} setUsers={setUsers} />}
    </div>
  );
};

export default Users;
