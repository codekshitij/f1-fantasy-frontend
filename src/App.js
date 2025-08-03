import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, Login, ProtectedRoute, useAuth } from './auth';
import LandingPage from './pages/LandingPage';
import './App.css';

// Simple Dashboard component for testing
const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '1rem'
        }}>
          <h1>🏎️ F1 Fantasy Dashboard</h1>
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Welcome, {user?.displayName || user?.firestoreUser?.name || 'F1 Fan'}! 🎉</h2>
          <p style={{ color: '#666' }}>Authentication is working successfully!</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3>🔥 Firebase User Info</h3>
            <p><strong>UID:</strong> {user?.uid}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? '✅' : '❌'}</p>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3>🔥 Firestore User Info</h3>
            <p><strong>UID:</strong> {user?.uid}</p>
            <p><strong>Name:</strong> {user?.firestoreUser?.name || 'Not set'}</p>
            <p><strong>Profile Complete:</strong> {user?.firestoreUser?.profileCompleted ? '✅' : '❌'}</p>
            <p><strong>Total Points:</strong> {user?.firestoreUser?.totalPoints || 0}</p>
            <p><strong>Rank:</strong> {user?.firestoreUser?.rank || 'Unranked'}</p>
          </div>
        </div>

        <div style={{ 
          background: '#e8f5e8', 
          padding: '1rem', 
          borderRadius: '6px',
          border: '1px solid #c3e6c3'
        }}>
          <h4>✅ Auth Test Results:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Firebase Authentication: ✅ Working</li>
            <li>Firestore Integration: {user?.firestoreUser ? '✅ Working' : '❌ Failed'}</li>
            <li>Token Available: {user?.getToken ? '✅ Yes' : '❌ No'}</li>
            <li>Protected Route: ✅ Working (you can see this page)</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            This is a test dashboard. Your authentication system is working! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple Loading Component
const LoadingScreen = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    color: 'white'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏎️</div>
      <p style={{ fontSize: '1.2rem' }}>Loading F1 Fantasy...</p>
    </div>
  </div>
);

// Main App with Auth Status Display
const AppContent = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect logic */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;