import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faChartLine,
  faCar,
  faUsers,
  faCalendarAlt,
  faHistory,
  faCoins,
  faChartBar,
  faSignOutAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const constructorBackgrounds = {
  'Red Bull Racing': '/images/redbull.png',
  'Mercedes': '/images/mercedes.png',
  'Ferrari': '/images/ferrari.png',
  'McLaren': '/images/mclaren.png',
  'Aston Martin': '/images/astonmartin.png',
  'Alpine': '/images/alpine.png',
  'Williams': '/images/williams.png',
  'AlphaTauri': '/images/visacashapp.png',
  'Alfa Romeo': '/images/kicksauber.png',
  'Haas F1 Team': '/images/haas.png'
};

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userTeam, setUserTeam] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [leagueStandings, setLeagueStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamPoints, setTeamPoints] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's team data
        const teamResponse = await axios.get('/fantasy/team/me');
        setUserTeam(teamResponse.data);
        
        // Set background image based on constructor
        if (teamResponse.data?.constructor) {
          setBackgroundImage(constructorBackgrounds[teamResponse.data.constructor] || '');
        }

        // Fetch team points
        const pointsResponse = await axios.get('/fantasy/points/me');
        setTeamPoints(pointsResponse.data.total_points || 0);

        // Fetch next race data from Ergast API
        const raceResponse = await axios.get('https://ergast.com/api/f1/2024/next.json');
        setNextRace(raceResponse.data.MRData.RaceTable.Races[0]);

        // Mock data for league standings
        setLeagueStandings([
          { position: 1, name: "Max's Fans", points: 325 },
          { position: 2, name: "Ferrari Forever", points: 280 },
          { position: 3, name: "McLaren Maniacs", points: 245 },
        ]);

        // Mock recent results
        setRecentResults([
          { race: "Bahrain GP", points: 49, position: 2 },
          { race: "Saudi Arabian GP", points: 42, position: 3 },
          { race: "Australian GP", points: 35, position: 5 },
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div 
      className="dashboard-container"
      style={{
        backgroundImage: backgroundImage ? ` url(${backgroundImage})` : '',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <header className="dashboard-header">
        <h1>Your F1 Fantasy Dashboard</h1>
        <div className="header-right">
          <div className="total-points">
            <FontAwesomeIcon icon={faTrophy} className="points-icon" />
            <span>{teamPoints} Points</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="btn-icon" />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Team Overview Card */}
        <div className="dashboard-card team-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faCar} className="card-icon" />
            <h3>Your Team</h3>
            <button 
              className="edit-team-btn" 
              onClick={() => navigate('/edit-team')}
            >
              <FontAwesomeIcon icon={faEdit} className="btn-icon" />
              Edit Team
            </button>
          </div>
          <div className="card-content">
            {userTeam && (
              <>
                <div className="driver-list">
                  <h4>Drivers</h4>
                  <div className="driver-item">
                    <span className="driver-name">{userTeam.driver_1}</span>
                  </div>
                  <div className="driver-item">
                    <span className="driver-name">{userTeam.driver_2}</span>
                  </div>
                  <div className="driver-item">
                    <span className="driver-name">{userTeam.driver_3}</span>
                  </div>
                  <div className="driver-item">
                    <span className="driver-name">{userTeam.driver_4}</span>
                  </div>
                </div>
                <div className="constructor">
                  <h4>Constructor</h4>
                  <span>{userTeam.constructor}</span>
                </div>
                <div className="budget">
                  <h4>Budget Remaining</h4>
                  <span className="budget-amount">${userTeam.budget_remaining}M</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next Race Card */}
        <div className="dashboard-card next-race-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faCalendarAlt} className="card-icon" />
            <h3>Next Race</h3>
          </div>
          <div className="card-content">
            {nextRace && (
              <>
                <h2 className="race-name">{nextRace.raceName}</h2>
                <div className="race-details">
                  <p className="race-date">
                    {new Date(nextRace.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="race-circuit">{nextRace.Circuit.circuitName}</p>
                  <p className="race-location">
                    {nextRace.Circuit.Location.locality}, {nextRace.Circuit.Location.country}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Results Card */}
        <div className="dashboard-card results-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faHistory} className="card-icon" />
            <h3>Recent Results</h3>
          </div>
          <div className="card-content">
            <div className="results-list">
              {recentResults.map((result, index) => (
                <div key={index} className="result-item">
                  <span className="race-name">{result.race}</span>
                  <div className="result-details">
                    <span className="points">{result.points} pts</span>
                    <span className="position">P{result.position}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* League Standings Card */}
        <div className="dashboard-card standings-card">
          <div className="card-header">
            <FontAwesomeIcon icon={faChartBar} className="card-icon" />
            <h3>League Standings</h3>
          </div>
          <div className="card-content">
            <div className="standings-list">
              {leagueStandings.map((standing, index) => (
                <div key={index} className="standing-item">
                  <span className="position">P{standing.position}</span>
                  <span className="team-name">{standing.name}</span>
                  <span className="points">{standing.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="primary-btn" onClick={() => navigate('/predict-race')}>
          <FontAwesomeIcon icon={faChartLine} className="btn-icon" />
          Predict Next Race
        </button>
        <button className="primary-btn" onClick={() => navigate('/race-results')}>
          <FontAwesomeIcon icon={faHistory} className="btn-icon" />
          Race Results
        </button>
        <button className="primary-btn" onClick={() => navigate('/leagues')}>
          <FontAwesomeIcon icon={faTrophy} className="btn-icon" />
          Leagues
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 