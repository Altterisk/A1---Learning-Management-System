import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberList from './pages/Members/MemberList';
import MemberEdit from './pages/Members/MemberEdit';
import MemberCreate from './pages/Members/MemberCreate';
import CourseList from './pages/Courses/CourseList';
import CourseEdit from './pages/Courses/CourseEdit';
import CourseCreate from './pages/Courses/CourseCreate';
import NotFound from './pages/NotFound';
import Home from './pages/Home'
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members/list" element={<ProtectedRoute element={<MemberList />} />} />
        <Route path="/members/edit/:id" element={<ProtectedRoute element={<MemberEdit />} />} />
        <Route path="/members/create" element={<ProtectedRoute element={<MemberCreate />} />} />
        <Route path="/courses/list" element={<ProtectedRoute element={<CourseList />} />} />
        <Route path="/courses/edit/:id" element={<ProtectedRoute element={<CourseEdit />} />} />
        <Route path="/courses/create" element={<ProtectedRoute element={<CourseCreate />} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
