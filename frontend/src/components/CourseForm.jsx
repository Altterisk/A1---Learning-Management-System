import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const CourseForm = ({ editingCourse, members }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teacherOptions = members.filter((member) => member.role === "Teacher");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teacher: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        teacher: editingCourse.teacher?._id || "",
        startDate: editingCourse.startDate ? new Date(editingCourse.startDate).toISOString().split("T")[0] : "",
        endDate: editingCourse.endDate ? new Date(editingCourse.endDate).toISOString().split("T")[0] : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        teacher: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [editingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await axiosInstance.put(`/api/courses/${editingCourse._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Course updated successfully!');
      } else {
        await axiosInstance.post('/api/courses', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Course created successfully!');
      }
      navigate('/courses/list');
    } catch (error) {
      alert('Failed to save Course.');
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingCourse ? "Edit Course" : "Create Course"}</h1>

      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        Course Title
      </label>
      <input
        type="text"
        id="title"
        placeholder="Enter course title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Course Description
      </label>
      <textarea
        id="description"
        placeholder="Enter course description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
        Assign a Teacher
      </label>

      {teacherOptions.length > 0 ? (
        <select
          id="teacher"
          value={formData.teacher}
          onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a Teacher</option>
          {teacherOptions.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-red-600 mb-4">
          No teachers available.
          <button
            onClick={() => navigate('/members/create')}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Create New Member
          </button>
        </p>
      )}

      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingCourse ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
};

export default CourseForm;
