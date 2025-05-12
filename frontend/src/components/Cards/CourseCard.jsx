import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();  
  const isAdmin = user?.role === 'Admin';
  const isTeacherOfCourse = user?.role === 'Teacher' && course.teacher ? user.id === course.teacher._id : false;

  return (
    <div className="border rounded-xl shadow-sm p-4 mb-4 bg-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold mb-2">{course.title}</h2>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Description:</span> {course.description || 'N/A'}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Teacher:</span> {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : 'None'}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Start Date:</span> {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">End Date:</span> {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A'}
        </p>
        <p className="text-sm text-gray-700 font-medium">
          <span className="font-semibold text-gray-900">Number of Students:</span> {Array.isArray(course.students) ? course.students.length : 0}
        </p>
      </div>

      {(isAdmin || isTeacherOfCourse) && (
        <div className="flex space-x-2 mt-4 justify-end">
          <button
            onClick={() => navigate(`/courses/edit/${course._id}`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold"
          >
            Edit
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => navigate(`/courses/assign/${course._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded font-semibold"
              >
                Assign
              </button>
              
              <button
                onClick={() => onDelete(course._id)}
                className="bg-red-500 text-white px-3 py-1 rounded font-semibold"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;