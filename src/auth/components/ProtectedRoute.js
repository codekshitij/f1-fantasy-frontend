import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  requireProfile = false 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🏎️</div>
        <p>Loading...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    // Save the location they were trying to go to
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Optional: Check if profile is completed (if required)
  if (requireProfile && user?.firestoreUser && !user.firestoreUser.profileCompleted) {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  // Authenticated - render the protected component
  return children;
};

export default ProtectedRoute;