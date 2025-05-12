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
import FullPageWrapper from './components/FullPageWrapper';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
              <FullPageWrapper><Home /></FullPageWrapper>
            } />
            <Route path="/login" element={
              <FullPageWrapper full><Login /></FullPageWrapper>
            } />
            <Route path="/register" element={
              <FullPageWrapper full><Register /></FullPageWrapper>
            } />
            <Route path="/profile" element={
              <FullPageWrapper><ProtectedRoute element={<Profile />} /></FullPageWrapper>
            } />
            <Route path="/changePassword" element={
              <FullPageWrapper><ProtectedRoute element={<ChangePassword />} /></FullPageWrapper>
            } />
            <Route path="/users/list" element={
              <FullPageWrapper><ProtectedRoute element={<UserList />} /></FullPageWrapper>
            } />
            <Route path="/users/edit/:id" element={
              <FullPageWrapper><ProtectedRoute element={<UserEdit />} /></FullPageWrapper>
            } />
            <Route path="/users/create" element={
              <FullPageWrapper><ProtectedRoute element={<UserCreate />} /></FullPageWrapper>
            } />
            <Route path="/courses/list" element={
              <FullPageWrapper><ProtectedRoute element={<CourseList />} /></FullPageWrapper>
            } />
            <Route path="/courses/edit/:id" element={
              <FullPageWrapper><ProtectedRoute element={<CourseEdit />} /></FullPageWrapper>
            } />
            <Route path="/courses/create" element={
              <FullPageWrapper><ProtectedRoute element={<CourseCreate />} /></FullPageWrapper>
            } />
            <Route path="*" element={
              <FullPageWrapper full><NotFound /></FullPageWrapper>
            } />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
