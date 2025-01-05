import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Main from './components/Main/Main';
import './App.css';
import PropTypes from 'prop-types';

function App() {
  // Check if user is logged in
  const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Add PropTypes validation
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
  };

  return (
    <Router>
      <Routes>
        {/* Default route - Login/Signup */}
        <Route path="/" element={<LoginSignup />} />
        
        {/* Protected Main route */}
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } 
        />

        {/* Redirect all other routes to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 