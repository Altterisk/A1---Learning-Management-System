import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import Loading from '../../components/Loading';
import CourseList from '../../components/CourseList';
import { useAuth } from '../../context/AuthContext';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setStarted(true);
        const response = await axiosInstance.get('/api/courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        alert('Failed to fetch Courses.');
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      {!started && <Loading/>}
      {started && loading && <Loading/>}
      {started && !loading && <CourseList courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default Courses;
