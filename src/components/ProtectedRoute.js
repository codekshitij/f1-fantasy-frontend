import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // ✅ Get stored token

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token"); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 Redirect to Profile Setup if the user has NOT set up their profile
  if (!user.name || !user.team || !user.avatar_url) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;
