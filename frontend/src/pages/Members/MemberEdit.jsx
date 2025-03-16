import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import MemberForm from '../../components/MemberForm';

import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const Members = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [editingMember, setEditingMember] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get(`/api/members/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditingMember(response.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch Member.');
      }
    };

    fetchMembers();
  }, [id, user]);

  return (
    <div className="container mx-auto p-6">
    {!started && <Loading/>}
    {started && loading && <Loading/>}
    {started && !loading && <MemberForm editingMember={editingMember}/>}
    </div>
  );
};

export default Members;
