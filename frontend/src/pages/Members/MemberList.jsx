import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import Loading from '../../components/Loading';
import MemberList from '../../components/MemberList';
import { useAuth } from '../../context/AuthContext';

const Members = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get('/api/members', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch Members.');
      }
    };

    fetchMembers();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {!started && <Loading/>}
      {started && loading && <Loading/>}
      {started && !loading && <MemberList members={members} setMembers={setMembers} />}
    </div>
  );
};

export default Members;
