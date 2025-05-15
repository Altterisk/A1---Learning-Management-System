import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import CourseCard from './Cards/CourseCard';

const CourseList = ({ courses, setCourses }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course? This cannot be undone!');
    if (!isConfirmed) return;
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      alert('Failed to delete Course.');
    }
  };

  return (
    <div>
     
        <div className="flex justify-between">
           {(user.role === 'Admin') && (
          <button
            onClick={() => navigate('/courses/create')}
            className="mb-4 mx-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Create New Course
          </button> )}
          <button
            onClick={() => navigate('/courses/list-package')}
            className="mb-4 mx-2  bg-green-500 text-white px-4 py-2 rounded"
          >
            View Course Packages
          </button>
        </div>
     

      
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found. Click "Create New Course" to add one.</p>
      ) : (
        <div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onDelete={handleDelete}
                showTeacher={course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'No teacher assigned'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;