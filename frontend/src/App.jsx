import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Requests from './pages/Requests';
import PublicCatalog from './pages/PublicCatalog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/public/:providerId" element={<PublicCatalog />} />
      </Routes>
    </Router>
  );
}

export default App;
