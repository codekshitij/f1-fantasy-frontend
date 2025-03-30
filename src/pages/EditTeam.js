import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import "./EditTeam.css";

const EditTeam = () => {
  const navigate = useNavigate();
  const [userTeam, setUserTeam] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState(null);
  const [budget, setBudget] = useState(45);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Driver and constructor data (same as CreateTeam)
  const drivers = [
    { id: 1, name: "Max Verstappen", price: 15.5, team: "Red Bull Racing" },
    { id: 2, name: "Sergio Perez", price: 12.0, team: "Red Bull Racing" },
    { id: 3, name: "Lewis Hamilton", price: 14.5, team: "Mercedes" },
    { id: 4, name: "George Russell", price: 12.5, team: "Mercedes" },
    { id: 5, name: "Charles Leclerc", price: 14.0, team: "Ferrari" },
    { id: 6, name: "Carlos Sainz", price: 12.5, team: "Ferrari" },
    { id: 7, name: "Lando Norris", price: 13.0, team: "McLaren" },
    { id: 8, name: "Oscar Piastri", price: 11.0, team: "McLaren" },
    { id: 9, name: "Fernando Alonso", price: 13.5, team: "Aston Martin" },
    { id: 10, name: "Lance Stroll", price: 10.5, team: "Aston Martin" },
  ];

  const constructors = [
    { id: 1, name: "Red Bull Racing", price: 25.0 },
    { id: 2, name: "Mercedes", price: 23.0 },
    { id: 3, name: "Ferrari", price: 22.0 },
    { id: 4, name: "McLaren", price: 20.0 },
    { id: 5, name: "Aston Martin", price: 18.0 },
  ];

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await axios.get("/fantasy/team/me");
        setUserTeam(response.data);
        // Set initial selections based on user's team
        setSelectedDrivers([
          response.data.driver_1,
          response.data.driver_2,
          response.data.driver_3,
          response.data.driver_4,
        ]);
        setSelectedConstructor(response.data.constructor);
      } catch (error) {
        console.error("Error fetching user team:", error);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTeam();
  }, []);

  const calculateRemainingBudget = () => {
    const driversCost = selectedDrivers.reduce(
      (total, driverName) => {
        const driver = drivers.find((d) => d.name === driverName);
        return total + (driver ? driver.price : 0);
      },
      0
    );

    const constructorCost = selectedConstructor
      ? constructors.find((c) => c.name === selectedConstructor)?.price || 0
      : 0;

    return budget - driversCost - constructorCost;
  };

  const handleDriverSelect = (driverName) => {
    if (selectedDrivers.includes(driverName)) {
      setSelectedDrivers(selectedDrivers.filter((d) => d !== driverName));
    } else if (selectedDrivers.length < 4) {
      setSelectedDrivers([...selectedDrivers, driverName]);
    } else {
      setError("You can only select 4 drivers");
    }
  };

  const handleConstructorSelect = (constructorName) => {
    setSelectedConstructor(constructorName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedDrivers.length !== 4) {
      setError("Please select exactly 4 drivers");
      return;
    }

    if (!selectedConstructor) {
      setError("Please select a constructor");
      return;
    }

    if (calculateRemainingBudget() < 0) {
      setError("Team exceeds budget limit");
      return;
    }

    try {
      const response = await axios.put("/fantasy/team/me", {
        driver_1: selectedDrivers[0],
        driver_2: selectedDrivers[1],
        driver_3: selectedDrivers[2],
        driver_4: selectedDrivers[3],
        constructor: selectedConstructor,
        budget_remaining: calculateRemainingBudget(),
      });

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      setError(error.response?.data?.detail || "Failed to update team");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-team-container">
      <div className="header-top">
        <button className="back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
          Back to Dashboard
        </button>
        <h1>Edit Your Team</h1>
      </div>

      <div className="budget-info">
        <div className="budget-item">
          <span>Total Budget:</span>
          <strong>${budget}M</strong>
        </div>
        <div className="budget-item">
          <span>Remaining Budget:</span>
          <strong className={calculateRemainingBudget() < 0 ? "error" : ""}>
            ${calculateRemainingBudget().toFixed(1)}M
          </strong>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="team-form">
        <div className="form-section">
          <h2>Select Drivers (4 required)</h2>
          <div className="drivers-grid">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className={`driver-card ${
                  selectedDrivers.includes(driver.name) ? "selected" : ""
                }`}
                onClick={() => handleDriverSelect(driver.name)}
              >
                <div className="driver-info">
                  <h3>{driver.name}</h3>
                  <p>{driver.team}</p>
                  <span className="price">${driver.price}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Select Constructor</h2>
          <div className="constructors-grid">
            {constructors.map((constructor) => (
              <div
                key={constructor.id}
                className={`constructor-card ${
                  selectedConstructor === constructor.name ? "selected" : ""
                }`}
                onClick={() => handleConstructorSelect(constructor.name)}
              >
                <div className="constructor-info">
                  <h3>{constructor.name}</h3>
                  <span className="price">${constructor.price}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          <FontAwesomeIcon icon={faSave} className="btn-icon" />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditTeam; 