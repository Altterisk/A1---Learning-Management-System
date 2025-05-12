import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const CourseList = ({ onSelectCourse }) => {
const [courses, setCourses] = useState([]);
const { user } = useAuth();

useEffect(() => {
    const fetchCourses = async () => {
      try {
        //setLoading(true);
        //setStarted(true);
        const response = await axiosInstance.get('/api/courses', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCourses(response.data);
        //setLoading(false);
      } catch (error) {
        alert('Failed to fetch Courses.');
      }
    };
    fetchCourses();
}, [user]);


return (
    <div>
      <h2>Select Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <input
              type="checkbox"
              onChange={() => onSelectCourse(course)}
            />
             &nbsp; {course.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
