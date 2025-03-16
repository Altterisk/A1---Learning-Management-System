import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import CourseForm from '../../components/CourseForm';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const CourseCreate = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [members, setMembers] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get(`/api/members`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(response.data);
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
    {started && !loading && <CourseForm editingCourse={false} members={members}/>}
    </div>
  );
};

export default CourseCreate;
