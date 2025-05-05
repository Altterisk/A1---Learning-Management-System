import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/Users/UserList';
import UserEdit from './pages/Users/UserEdit';
import UserCreate from './pages/Users/UserCreate';
import CourseList from './pages/Courses/CourseList';
import CourseEdit from './pages/Courses/CourseEdit';
import CourseCreate from './pages/Courses/CourseCreate';
import NotFound from './pages/NotFound';
import Home from './pages/Home'
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/changePassword" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/users/list" element={<ProtectedRoute element={<UserList />} />} />
        <Route path="/users/edit/:id" element={<ProtectedRoute element={<UserEdit />} />} />
        <Route path="/users/create" element={<ProtectedRoute element={<UserCreate />} />} />
        <Route path="/courses/list" element={<ProtectedRoute element={<CourseList />} />} />
        <Route path="/courses/edit/:id" element={<ProtectedRoute element={<CourseEdit />} />} />
        <Route path="/courses/create" element={<ProtectedRoute element={<CourseCreate />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
