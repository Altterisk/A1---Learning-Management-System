import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import CoursePackageList from './CoursePackageList';
import useFormValidation from '../hooks/useFormValidation';

const CoursePackageForm = ({ users }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');

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

  const handleSelectCourse = (course) => {
    setSelectedCourses((prev) => {
      if (prev.find((c) => c._id === course._id)) {
        return prev.filter((c) => c._id !== course._id);
      }
      return [...prev, course];
    });
  };


const { formData, errors } = useFormValidation({
    title: '',
    description: '',
  }, validate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axiosInstance.post('/api/course-packages', {
        name: packageName,
        description: packageDescription,
        included_courses: selectedCourses.map((course) => course._id), 
        }, { 
        headers: { Authorization: `Bearer ${user.token}` }, 
      });
      alert('Package created successfully!');
      navigate('/courses/list-package');
    } catch (error) {
      console.error('Error creating package', error);
    }
  }; 
  
  return (
    <div> 

    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
    <h1 className="text-2xl font-bold mb-4">Create Course Package </h1>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Package Name
      </label>
      <input
          type="text"
          id="name"
          placeholder="Package Name"
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
      {errors.name && <p className="text-red-600 mb-2">{errors.name}</p>}
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        Package Description
      </label>

      <textarea
        id="description"
        placeholder="Package Description"
        value={packageDescription}
        onChange={(e) => setPackageDescription(e.target.value)}
        name="description"
        className="w-full mb-4 p-2 border rounded"
        required
        />
     
      {errors.description && <p className="text-red-600 mb-2">{errors.description}</p>}
        <CoursePackageList onSelectCourse={handleSelectCourse} />
        <button type="submit" className="my-4 bg-green-500 text-white px-4 py-2 rounded" >Create Package</button>
      </form>
    </div>  
  );
};
export default CoursePackageForm;
