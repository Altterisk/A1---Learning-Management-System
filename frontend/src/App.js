import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberList from './pages/Members/MemberList';
import MemberEdit from './pages/Members/MemberEdit';
import MemberCreate from './pages/Members/MemberCreate';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members/list" element={<MemberList />} />
        <Route path="/members/edit/:id" element={<MemberEdit />} />
        <Route path="/members/create" element={<MemberCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
