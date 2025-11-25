import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#2d3748',
        color: '#f2e9b9',
        fontFamily: 'DM Mono',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to home page
  if (!user) {
    // Save the attempted location so we can redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
