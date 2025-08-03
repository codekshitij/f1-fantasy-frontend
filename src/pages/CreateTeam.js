import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './CreateTeam.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faCoins, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // ✅ Import Auth context

const drivers = [
  { id: 'max_verstappen', name: 'Max Verstappen', price: 5.5, team: 'Red Bull Racing' },
  { id: 'sergio_perez', name: 'Sergio Perez', price: 4.5, team: 'Red Bull Racing' },
  { id: 'lewis_hamilton', name: 'Lewis Hamilton', price: 5.0, team: 'Mercedes' },
  { id: 'george_russell', name: 'George Russell', price: 4.0, team: 'Mercedes' },
  { id: 'charles_leclerc', name: 'Charles Leclerc', price: 5.0, team: 'Ferrari' },
  { id: 'carlos_sainz', name: 'Carlos Sainz', price: 4.0, team: 'Ferrari' },
  { id: 'lando_norris', name: 'Lando Norris', price: 4.5, team: 'McLaren' },
  { id: 'oscar_piastri', name: 'Oscar Piastri', price: 3.5, team: 'McLaren' },
  { id: 'fernando_alonso', name: 'Fernando Alonso', price: 4.5, team: 'Aston Martin' },
  { id: 'lance_stroll', name: 'Lance Stroll', price: 3.0, team: 'Aston Martin' }
];

const constructors = [
  { id: 'Red Bull Racing', name: 'Red Bull Racing', price: 5.0 },
  { id: 'Mercedes', name: 'Mercedes', price: 4.5 },
  { id: 'Ferrari', name: 'Ferrari', price: 4.0 },
  { id: 'McLaren', name: 'McLaren', price: 3.5 },
  { id: 'Aston Martin', name: 'Aston Martin', price: 3.0 },
  { id: 'Alpine', name: 'Alpine', price: 2.5 },
  { id: 'Williams', name: 'Williams', price: 2.0 },
  { id: 'AlphaTauri', name: 'VISA Cash App RB', price: 2.0 },
  { id: 'Alfa Romeo', name: 'Kick Sauber', price: 2.0 },
  { id: 'Haas F1 Team', name: 'Haas F1 Team', price: 2.0 }
];

const CreateTeam = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // ✅ Access Auth Context
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);
  const [budget, setBudget] = useState(45.0);
  const [error, setError] = useState('');

  // Check if user already has a team and redirect to dashboard
  useEffect(() => {
    const checkTeam = async () => {
      if (!user) return;

      try {
        // First check if we already know the user has a team
        if (user.team || user.fantasy_team_id) {
          navigate('/dashboard');
          return;
        }

        // If not, check with the server
        const response = await axios.get('/fantasy/team/me');
        if (response.status === 200) {
          setUser({ ...user, team: response.data });
          navigate('/dashboard');
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error checking team:', error);
          if (error.response?.status === 401) {
            navigate('/login');
          }
        }
      }
    };
    
    checkTeam();
  }, [user, setUser, navigate]);



  const calculateRemainingBudget = () => {
    const driversCost = selectedDrivers.reduce((sum, driver) => sum + driver.price, 0);
    const constructorCost = selectedConstructor ? selectedConstructor.price : 0;
    return (45.0 - driversCost - constructorCost).toFixed(1);
  };

  const handleDriverSelect = (driver) => {
    if (selectedDrivers.find(d => d.id === driver.id)) {
      setSelectedDrivers(selectedDrivers.filter(d => d.id !== driver.id));
      setBudget(prev => prev + driver.price);
    } else if (selectedDrivers.length < 4) {
      const newBudget = budget - driver.price;
      if (newBudget >= 0) {
        setSelectedDrivers([...selectedDrivers, driver]);
        setBudget(newBudget);
        setError('');
      } else {
        setError('Not enough budget!');
      }
    } else {
      setError('You can only select 4 drivers!');
    }
  };

  const handleConstructorSelect = (constructor) => {
    if (selectedConstructor && selectedConstructor.id === constructor.id) {
      setSelectedConstructor(null);
      setBudget(prev => prev + constructor.price);
    } else {
      const newBudget = budget - (selectedConstructor ? -selectedConstructor.price : 0) - constructor.price;
      if (newBudget >= 0) {
        setSelectedConstructor(constructor);
        setBudget(newBudget);
        setError('');
      } else {
        setError('Not enough budget!');
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedDrivers.length !== 4 || !selectedConstructor) {
      setError('Please select 4 drivers and 1 constructor!');
      return;
    }

    try {
      const response = await axios.post('/fantasy/team', {
        driver_1: selectedDrivers[0].id,
        driver_2: selectedDrivers[1].id,
        driver_3: selectedDrivers[2].id,
        driver_4: selectedDrivers[3].id,
        constructor: selectedConstructor.id,
        budget_remaining: parseFloat(calculateRemainingBudget())
      });

      if (response.status === 200 || response.status === 201) {
        // ✅ Update user context to reflect team is created
        setUser({ ...user, team: response.data });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.detail || 'Error creating team. Please try again.');
        console.error('Error:', error);
      }
    }
  };

  const handleBack = () => {
    navigate('/pre-dashboard');
  };

  return (
    <div className="create-team-container">
      <header className="create-team-header">
        <div className="header-top">
          <button className="back-btn" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
            Back to Pre-Dashboard
          </button>
          <h1>Create Your F1 Fantasy Team</h1>
        </div>
        <div className="budget-display">
          <FontAwesomeIcon icon={faCoins} className="budget-icon" />
          <span>Budget Remaining: ${calculateRemainingBudget()}M</span>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="selection-container">
        <div className="drivers-section">
          <h2>Select 4 Drivers</h2>
          <div className="drivers-grid">
            {drivers.map(driver => (
              <div
                key={driver.id}
                className={`driver-card ${selectedDrivers.find(d => d.id === driver.id) ? 'selected' : ''}`}
                onClick={() => handleDriverSelect(driver)}
              >
                <div className="driver-info">
                  <span className="driver-name">{driver.name}</span>
                  <span className="driver-team">{driver.team}</span>
                  <span className="driver-price">${driver.price}M</span>
                </div>
                {selectedDrivers.find(d => d.id === driver.id) && (
                  <FontAwesomeIcon icon={faCheck} className="selected-icon" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="constructors-section">
          <h2>Select Constructor</h2>
          <div className="constructors-grid">
            {constructors.map(constructor => (
              <div
                key={constructor.id}
                className={`constructor-card ${selectedConstructor?.id === constructor.id ? 'selected' : ''}`}
                onClick={() => handleConstructorSelect(constructor)}
              >
                <div className="constructor-info">
                  <span className="constructor-name">{constructor.name}</span>
                  <span className="constructor-price">${constructor.price}M</span>
                </div>
                {selectedConstructor?.id === constructor.id && (
                  <FontAwesomeIcon icon={faCheck} className="selected-icon" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="create-team-actions">
        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedDrivers.length !== 4 || !selectedConstructor}
        >
          <FontAwesomeIcon icon={faCar} className="btn-icon" />
          Create Team
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
