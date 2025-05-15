import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CoursesPackageList = () => {
  const { user } = useAuth();
  const [packages, setCoursePackages] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCoursesPackage = async () => {
      try {
        const response = await axiosInstance.get('/api/course-packages', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCoursePackages(response.data);
      } catch (error) {
        alert('Failed to fetch Course Packages.');
      }
    };

    fetchCoursesPackage();
  }, [user]);

  return (
    <div className='container mx-auto p-6'>
    <div className="flex justify-between">
         <button
            onClick={() => navigate('/courses/list')}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Course List
          </button>
      {(user.role === 'Admin') && (
        
          <button
            onClick={() => navigate('/courses/create-package')}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Create New Course Package
          </button>
       
      )}
    </div>
    <div >
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">    
        {Array.isArray(packages) &&  packages.map(pkg => (
        <div key={pkg._id} className='border rounded-xl shadow-sm p-4 mb-4 bg-white flex flex-col  h-full' >
          <h2 className='uppercase'><strong>{pkg.name}</strong></h2>
          <p>{pkg.description}</p>
          <p className='mt-3 capitalize font-semibold text-sm text-gray-500'>Courses Included:</p>
          <ul >
            {pkg.included_courses.map(course => (
              <li key={course._id} className='py-1'>
                <p className='text-sm font-medium'>{course.title}</p>
                <p className='text-sm italic'>{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
        ))} </div>
      </div>
      </div>
  ); 
};

export default CoursesPackageList;