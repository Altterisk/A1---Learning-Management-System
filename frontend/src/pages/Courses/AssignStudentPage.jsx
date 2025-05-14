import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../axiosConfig';

const AssignStudentsPage = () => {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentRes, courseRes] = await Promise.all([
        axiosInstance.get('/api/users?role=Student', {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axiosInstance.get(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);
      setStudents(studentRes.data);
      setCourse(courseRes.data);
      setLoading(false);
    } catch (error) {
      alert('Failed to load data');
      console.error(error);
    }
  }, [user.token, courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (studentId) => {
    try {
      await axiosInstance.post(`/api/courses/${courseId}/register`, { student_id: studentId }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchData(); // Refresh
    } catch (error) {
      alert('Assignment failed');
      console.error(error);
    }
  };

  const handleUnassign = async (studentId) => {
    try {
      await axiosInstance.post(`/api/courses/${courseId}/unregister`, { student_id: studentId }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchData(); // Refresh
    } catch (error) {
      alert('Unassignment failed');
      console.error(error);
    }
  };

  if (loading || !course) return <div>Loading...</div>;

  const assignedIds = course.students;
  const assignedStudents = students.filter((s) => assignedIds.includes(s._id));
  const availableStudents = students.filter((s) => !assignedIds.includes(s._id));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Assign Students to: {course.title}</h2>
  
      <div className="grid md:grid-cols-2 gap-8">
        {/* Assigned Students Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Assigned Students</h3>
          {assignedStudents.length === 0 ? (
            <p className="text-gray-500">No students assigned yet.</p>
          ) : (
            <ul className="space-y-4">
              {assignedStudents.map((s) => (
                <li key={s._id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition">
                  <span className="text-gray-800">{s.firstName} {s.lastName}</span>
                  <button
                    onClick={() => handleUnassign(s._id)}
                    className="text-red-600 font-semibold hover:text-red-800"
                  >
                    Unassign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
  
        {/* Available Students Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Available Students</h3>
          {availableStudents.length === 0 ? (
            <p className="text-gray-500">No available students to assign.</p>
          ) : (
            <ul className="space-y-4">
              {availableStudents.map((s) => (
                <li key={s._id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition">
                  <span className="text-gray-800">{s.firstName} {s.lastName}</span>
                  <button
                    onClick={() => handleAssign(s._id)}
                    className="text-green-600 font-semibold hover:text-green-800"
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignStudentsPage;