import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import PreDashboard from "./pages/PreDashboard";
import Dashboard from "./pages/Dashboard";
import CreateTeam from "./pages/CreateTeam";
import EditTeam from "./pages/EditTeam";
import PredictRace from "./pages/PredictRace";
import RaceResults from "./pages/RaceResults";
import Leagues from "./pages/Leagues";
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from "./pages/LandingPage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // ✅ Add loading if you have one
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const DashboardRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return user.team ? children : <Navigate to="/create-team" />;
};

const PreDashboardRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const TeamRequiredRoute = ({ children }) => {
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pre-dashboard" element={<PreDashboard />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/edit-team" element={<EditTeam />} />
          <Route path="/predict-race" element={<PredictRace />} />
          <Route path="/race-results" element={<RaceResults />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
