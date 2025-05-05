import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import useFormValidation from '../hooks/useFormValidation';

const CourseForm = ({ editingCourse, users }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const teacherOptions = users.filter((user) => user.role === "Teacher");

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) {
      tempErrors.title = "Title is required";
    }
    if (!formData.description) {
      tempErrors.description = "Description is required";
    }

    return tempErrors;
  };
  
  const { formData, errors, handleChange, handleBlur, handleSubmit, setFormData } = useFormValidation({
    title: '',
    description: '',
    teacher: '',
    startDate: '',
    endDate: ''
  }, validate);

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
  }, [editingCourse, setFormData]);

  const onSubmit = async (e) => {
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
    <form onSubmit={(e) => handleSubmit(e, onSubmit)} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingCourse ? "Edit Course" : "Create Course"}</h1>

      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
        Course Title
      </label>
      <input
        type="text"
        id="title"
        placeholder="Enter course title"
        value={formData.title}
        onChange={handleChange}
        onBlur={handleBlur}
        name="title"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      {errors.title && <p className="text-red-600 mb-2">{errors.title}</p>}

      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Course Description
      </label>
      <textarea
        id="description"
        placeholder="Enter course description"
        value={formData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        name="description"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.description && <p className="text-red-600 mb-2">{errors.description}</p>}

      <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-1">
        Assign a Teacher
      </label>

      {teacherOptions.length > 0 ? (
        <select
          id="teacher"
          value={formData.teacher}
          onChange={handleChange}
          onBlur={handleBlur}
          name="teacher"
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select a Teacher</option>
          {teacherOptions.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-red-600 mb-4">
          No teachers available.
          <button
            onClick={() => navigate('/users/create')}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Create New User
          </button>
        </p>
      )}
      {errors.teacher && <p className="text-red-600 mb-2">{errors.teacher}</p>}

      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
        Start Date
      </label>
      <input
        type="date"
        id="startDate"
        value={formData.startDate}
        onChange={handleChange}
        onBlur={handleBlur}
        name="startDate"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.startDate && <p className="text-red-600 mb-2">{errors.startDate}</p>}

      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
        End Date
      </label>
      <input
        type="date"
        id="endDate"
        value={formData.endDate}
        onChange={handleChange}
        onBlur={handleBlur}
        name="endDate"
        className="w-full mb-4 p-2 border rounded"
      />
      {errors.endDate && <p className="text-red-600 mb-2">{errors.endDate}</p>}

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingCourse ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
};

export default CourseForm;
