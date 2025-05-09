import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import UserForm from '../../components/UserForm';

import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const Users = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [editingUser, setEditingUser] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditingUser(response.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch User.');
      }
    };

    fetchUsers();
  }, [id, user]);

  return (
    <div className="container mx-auto p-6">
    {!started && <Loading/>}
    {started && loading && <Loading/>}
    {started && !loading && <UserForm editingUser={editingUser}/>}
    </div>
  );
};

export default Users;
