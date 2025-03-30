import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave, faTrophy, faFlag, faBolt } from "@fortawesome/free-solid-svg-icons";
import "./PredictRace.css";

const PredictRace = () => {
  const navigate = useNavigate();
  const [userTeam, setUserTeam] = useState(null);
  const [predictions, setPredictions] = useState({
    pole: "",
    first: "",
    second: "",
    third: "",
    fourth: "",
    fastestLap: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserTeam = async () => {
      try {
        const response = await axios.get("/fantasy/team/me");
        setUserTeam(response.data);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTeam();
  }, []);

  const handlePositionSelect = (driver, position) => {
    // Clear the position if it's already assigned to another driver
    const updatedPredictions = { ...predictions };
    Object.keys(updatedPredictions).forEach(key => {
      if (updatedPredictions[key] === driver) {
        updatedPredictions[key] = "";
      }
    });
    // Assign the new position
    updatedPredictions[position] = driver;
    setPredictions(updatedPredictions);
  };

  const getDriverPosition = (driver) => {
    for (const [position, assignedDriver] of Object.entries(predictions)) {
      if (assignedDriver === driver) {
        return position;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate predictions
    if (!predictions.pole || !predictions.first || !predictions.second || !predictions.third || !predictions.fourth || !predictions.fastestLap) {
      setError("Please assign all positions and special awards");
      return;
    }

    try {
      const response = await axios.post("/fantasy/predictions", predictions);
      if (response.status === 200) {
        setSuccess("Predictions saved successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving predictions:", error);
      setError(error.response?.data?.detail || "Failed to save predictions");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userTeam) {
    return <div className="error-message">No team found. Please create a team first.</div>;
  }

  const teamDrivers = [
    userTeam.driver_1,
    userTeam.driver_2,
    userTeam.driver_3,
    userTeam.driver_4,
  ];

  const positionLabels = {
    pole: "Pole Position",
    first: "1st Place",
    second: "2nd Place",
    third: "3rd Place",
    fourth: "4th Place",
    fastestLap: "Fastest Lap"
  };

  return (
    <div className="predict-race-container">
      <div className="header-top">
        <button className="back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
          Back to Dashboard
        </button>
        <h1>Race Predictions</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="predictions-legend">
        <div className="legend-item">
          <FontAwesomeIcon icon={faFlag} className="legend-icon pole" />
          <span>Pole Position</span>
        </div>
        <div className="legend-item">
          <FontAwesomeIcon icon={faTrophy} className="legend-icon podium" />
          <span>Race Position</span>
        </div>
        <div className="legend-item">
          <FontAwesomeIcon icon={faBolt} className="legend-icon fastest" />
          <span>Fastest Lap</span>
        </div>
      </div>

      <div className="drivers-grid">
        {teamDrivers.map((driver, index) => {
          const currentPosition = getDriverPosition(driver);
          return (
            <div key={index} className="driver-card">
              <h3 className="driver-name">{driver}</h3>
              <div className="position-buttons">
                <button
                  type="button"
                  className={`position-btn pole ${currentPosition === 'pole' ? 'selected' : ''}`}
                  onClick={() => handlePositionSelect(driver, 'pole')}
                >
                  <FontAwesomeIcon icon={faFlag} />
                </button>
                {['first', 'second', 'third', 'fourth'].map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    className={`position-btn ${pos} ${currentPosition === pos ? 'selected' : ''}`}
                    onClick={() => handlePositionSelect(driver, pos)}
                  >
                    {pos === 'first' ? '1' : pos === 'second' ? '2' : pos === 'third' ? '3' : '4'}
                  </button>
                ))}
                <button
                  type="button"
                  className={`position-btn fastest ${currentPosition === 'fastestLap' ? 'selected' : ''}`}
                  onClick={() => handlePositionSelect(driver, 'fastestLap')}
                >
                  <FontAwesomeIcon icon={faBolt} />
                </button>
              </div>
              {currentPosition && (
                <div className="current-position">
                  {positionLabels[currentPosition]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handleSubmit} className="submit-btn">
        <FontAwesomeIcon icon={faSave} className="btn-icon" />
        Save Predictions
      </button>
    </div>
  );
};

export default PredictRace; 