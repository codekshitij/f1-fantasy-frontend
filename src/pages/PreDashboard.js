import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import "./PreDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faChartLine, faUsers, faCalendarAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PreDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch race calendar
        const racesResponse = await axios.get("https://ergast.com/api/f1/2024.json");
        setRaces(racesResponse.data.MRData.RaceTable.Races);

        // Mock data for standings (replace with actual API calls later)
        setDriverStandings([
          { position: 1, driver: "Max Verstappen", points: 51 },
          { position: 2, driver: "Sergio Perez", points: 36 },
          { position: 3, driver: "Charles Leclerc", points: 28 },
        ]);

        setConstructorStandings([
          { position: 1, constructor: "Red Bull Racing", points: 87 },
          { position: 2, constructor: "Ferrari", points: 49 },
          { position: 3, constructor: "McLaren", points: 28 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="pre-dashboard-container">
      <header className="dashboard-header">
        <h1>👋 Welcome to F1 Fantasy League</h1>
        <div className="header-right">
          <p className="subtitle">Your Ultimate F1 Fantasy Experience</p>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="btn-icon" />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Budget Overview Card */}
        <div className="dashboard-card budget-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faChartLine} className="card-icon" />
            <h3>Budget Overview</h3>
          </div>
          <div className="card-content">
            <div className="budget-item">
              <span>Total Budget:</span>
              <strong>$45M</strong>
            </div>
            <div className="budget-item">
              <span>Used:</span>
              <strong>$38.5M</strong>
            </div>
            <div className="budget-item">
              <span>Remaining:</span>
              <strong className="highlight">$6.5M</strong>
            </div>
            <div className="budget-item">
              <span>Earned This Season:</span>
              <strong className="highlight">$12M</strong>
            </div>
          </div>
        </div>

        {/* Driver Standings Card */}
        <div className="dashboard-card standings-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faTrophy} className="card-icon" />
            <h3>Driver Standings</h3>
          </div>
          <div className="card-content">
            {driverStandings.map((standing) => (
              <div key={standing.position} className="standing-item">
                <span className="position">{standing.position}</span>
                <span className="name">{standing.driver}</span>
                <span className="points">{standing.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Constructor Standings Card */}
        <div className="dashboard-card constructor-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faUsers} className="card-icon" />
            <h3>Constructor Standings</h3>
          </div>
          <div className="card-content">
            {constructorStandings.map((standing) => (
              <div key={standing.position} className="standing-item">
                <span className="position">{standing.position}</span>
                <span className="name">{standing.constructor}</span>
                <span className="points">{standing.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Race Calendar Card */}
        <div className="dashboard-card calendar-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
            <h3>Upcoming Races</h3>
          </div>
          <div className="card-content">
            {races.slice(0, 3).map((race) => (
              <div key={race.round} className="race-item">
                <div className="race-date">
                  {new Date(race.date).toLocaleDateString()}
                </div>
                <div className="race-name">{race.raceName}</div>
                <div className="race-circuit">{race.Circuit.circuitName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="primary-btn">Choose Your Team</button>
        <button className="secondary-btn">View Full Calendar</button>
      </div>
    </div>
  );
};

export default PreDashboard;
