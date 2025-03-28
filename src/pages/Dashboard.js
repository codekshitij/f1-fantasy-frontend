import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Dashboard.css"; // Import external CSS

const teamImages = {
  "Mercedes": "/images/mercedes.png",
  "Red Bull": "/images/redbull.png",
  "Ferrari": "/images/ferrari.png",
  "McLaren": "/images/mclaren.png",
  "Aston Martin": "/images/astonmartin.png",
  "Alpine": "/images/alpine.png",
  "Williams": "/images/williams.png",
  "Haas": "/images/haas.png",
  "Kick Sauber": "/images/kicksauber.png",
  "Visa CashApp Bull Racing": "/images/visa.png",
};

// Team colors (for name color)
const teamColors = {
  "Mercedes": "#00D2BE",
  "Red Bull": "#1E41FF",
  "Ferrari": "#DC0000",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine": "#2293D1",
  "Williams": "#37BEDD",
  "Haas": "#B6BABD",
  "Kick Sauber": "#52B947",
  "Visa CashApp Bull Racing": "#005AFF",
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
        const userData = JSON.parse(savedProfile);
        console.log("Loaded User Profile:", userData);
        setUser(userData);  // Ensure it's updating state
    }
  }, []);
  
  useEffect(() => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    setUser(JSON.parse(storedProfile)); // ✅ Force a state update
  }
  }, []);



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div
      className="dashboard-container"
      style={{ backgroundImage: `url(${teamImages[user.team]})` }}
    >
      <div className="dashboard-overlay">
        {/* Left-side Profile Info */}
        <div className="profile-section">
          <img
            src={window.location.origin + user.avatar_url}
            alt="User Avatar"
            onError={(e) => {
              console.error("Avatar failed to load:", e.target.src);
              e.target.src = "/avatars/default.png"; // Fallback image
            }}
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
          <div className="user-info">
            <h1 className="user-name" style={{ color: teamColors[user.team] }}>
              {user.name}
            </h1>
            <h2 className="team-name">{user.team}</h2>
          </div>
        </div>

        {/* Right-side Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
