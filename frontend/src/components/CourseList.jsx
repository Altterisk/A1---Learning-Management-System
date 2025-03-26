import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const CourseList = ({ courses, setCourses }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (courseId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this course? This cannot be undo!');
    if (!isConfirmed) return;
    try {
      await axiosInstance.delete(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      alert('Failed to delete Course.');
      console.log(error)
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/courses/create')}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Create New Course
        </button>
      </div>
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses found. Click "Create New Course" to add one.</p>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-200">Title</th>
                <th className="px-4 py-2 border border-gray-200">Description</th>
                <th className="px-4 py-2 border border-gray-200">Teacher</th>
                <th className="px-4 py-2 border border-gray-200">Start Date</th>
                <th className="px-4 py-2 border border-gray-200">End Date</th>
                <th className="px-4 py-2 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">{course.title}</td>
                    <td className="px-4 py-2 border border-gray-200">{course.description || "N/A"}</td>
                    <td className="px-4 py-2 border border-gray-200">
                      {course.teacher ? course.teacher.name ? course.teacher.name : "None" : "None"}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      {course.endDate ? new Date(course.endDate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      <button
                        onClick={() => navigate(`/courses/edit/${course._id}`)}
                        className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CourseList;
