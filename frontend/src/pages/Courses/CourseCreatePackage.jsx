import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig'; 
import CoursePackageForm from '../../components/CoursePackageForm';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const CourseCreatePackage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get(`/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
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
    {started && !loading && <CoursePackageForm  users={users}/>}
    </div>
  );
};

export default CourseCreatePackage;
