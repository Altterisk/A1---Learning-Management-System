import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import CourseForm from '../../components/CourseForm';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';

const Courses = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [editingCourse, setEditingCourse] = useState(null);
  const [users, setUsers] = useState(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setEditingCourse(response.data);
        const courseResponse = await axiosInstance.get(`/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(courseResponse.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch Course.');
      }
    };

    fetchCourses();
  }, [id, user]);

  return (
    <div className="container mx-auto p-6">
    {!started && <Loading/>}
    {started && loading && <Loading/>}
    {started && !loading && <CourseForm editingCourse={editingCourse} users={users}/>}
    </div>
  );
};

export default Courses;
