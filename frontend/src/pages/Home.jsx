import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import CourseCard from '../components/Cards/CourseCard';

const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user || user.role === 'Admin') return;

      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/courses/mycourses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch user courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [user]);

  if (!user || user.role === 'Admin') {
    return (
      <div className="text-center p-12">
        <h1 className="text-3xl font-bold mb-2">Learning Management System 2</h1>
        <p className="text-gray-700">Manage Teachers, Students and Courses</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {user.role === 'Teacher' ? 'Courses You Are Teaching' : 'Your Enrolled Courses'}
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              showTeacher={
                course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'No teacher assigned'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;