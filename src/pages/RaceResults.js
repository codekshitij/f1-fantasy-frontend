import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrophy, faFlag, faBolt, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./RaceResults.css";

const RaceResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch race results and user predictions
        const [resultsResponse, predictionsResponse] = await Promise.all([
          axios.get("/fantasy/race/latest/results"),
          axios.get("/fantasy/predictions/latest")
        ]);

        setResults(resultsResponse.data);
        setPredictions(predictionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load race results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculatePoints = (prediction, actual) => {
    let points = 0;
    // Pole position - 10 points
    if (prediction.pole === actual.pole) points += 10;
    
    // Race positions
    if (prediction.first === actual.first) points += 25;
    if (prediction.second === actual.second) points += 18;
    if (prediction.third === actual.third) points += 15;
    if (prediction.fourth === actual.fourth) points += 12;
    
    // Fastest lap - 8 points
    if (prediction.fastestLap === actual.fastestLap) points += 8;
    
    return points;
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!results || !predictions) {
    return (
      <div className="race-results-container">
        <div className="header-top">
          <button className="back-btn" onClick={handleBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
            Back to Dashboard
          </button>
          <h1>Race Results</h1>
        </div>
        <div className="error-message">No race results available yet.</div>
      </div>
    );
  }

  const totalPoints = calculatePoints(predictions, results);

  return (
    <div className="race-results-container">
      <div className="header-top">
        <button className="back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
          Back to Dashboard
        </button>
        <h1>Race Results</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="race-info">
        <h2>{results.raceName}</h2>
        <p className="race-date">{new Date(results.date).toLocaleDateString()}</p>
        <div className="points-summary">
          <h3>Points Earned: {totalPoints}</h3>
        </div>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h3>
            <FontAwesomeIcon icon={faFlag} className="card-icon pole" />
            Pole Position
          </h3>
          <div className="prediction-result">
            <div className="prediction">
              <p>Your Prediction</p>
              <span className={predictions.pole === results.pole ? "correct" : "incorrect"}>
                {predictions.pole}
                <FontAwesomeIcon 
                  icon={predictions.pole === results.pole ? faCheckCircle : faTimesCircle} 
                  className="result-icon"
                />
              </span>
            </div>
            <div className="actual">
              <p>Actual Result</p>
              <span>{results.pole}</span>
            </div>
            {predictions.pole === results.pole && <div className="points">+10 points</div>}
          </div>
        </div>

        <div className="result-card">
          <h3>
            <FontAwesomeIcon icon={faTrophy} className="card-icon gold" />
            Race Results
          </h3>
          <div className="race-positions">
            <div className="position-row">
              <span className="position">1st</span>
              <div className="prediction-result">
                <span className={predictions.first === results.first ? "correct" : "incorrect"}>
                  {predictions.first}
                  <FontAwesomeIcon 
                    icon={predictions.first === results.first ? faCheckCircle : faTimesCircle} 
                    className="result-icon"
                  />
                </span>
                <span className="actual">{results.first}</span>
                {predictions.first === results.first && <span className="points">+25</span>}
              </div>
            </div>
            <div className="position-row">
              <span className="position">2nd</span>
              <div className="prediction-result">
                <span className={predictions.second === results.second ? "correct" : "incorrect"}>
                  {predictions.second}
                  <FontAwesomeIcon 
                    icon={predictions.second === results.second ? faCheckCircle : faTimesCircle} 
                    className="result-icon"
                  />
                </span>
                <span className="actual">{results.second}</span>
                {predictions.second === results.second && <span className="points">+18</span>}
              </div>
            </div>
            <div className="position-row">
              <span className="position">3rd</span>
              <div className="prediction-result">
                <span className={predictions.third === results.third ? "correct" : "incorrect"}>
                  {predictions.third}
                  <FontAwesomeIcon 
                    icon={predictions.third === results.third ? faCheckCircle : faTimesCircle} 
                    className="result-icon"
                  />
                </span>
                <span className="actual">{results.third}</span>
                {predictions.third === results.third && <span className="points">+15</span>}
              </div>
            </div>
            <div className="position-row">
              <span className="position">4th</span>
              <div className="prediction-result">
                <span className={predictions.fourth === results.fourth ? "correct" : "incorrect"}>
                  {predictions.fourth}
                  <FontAwesomeIcon 
                    icon={predictions.fourth === results.fourth ? faCheckCircle : faTimesCircle} 
                    className="result-icon"
                  />
                </span>
                <span className="actual">{results.fourth}</span>
                {predictions.fourth === results.fourth && <span className="points">+12</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="result-card">
          <h3>
            <FontAwesomeIcon icon={faBolt} className="card-icon fastest" />
            Fastest Lap
          </h3>
          <div className="prediction-result">
            <div className="prediction">
              <p>Your Prediction</p>
              <span className={predictions.fastestLap === results.fastestLap ? "correct" : "incorrect"}>
                {predictions.fastestLap}
                <FontAwesomeIcon 
                  icon={predictions.fastestLap === results.fastestLap ? faCheckCircle : faTimesCircle} 
                  className="result-icon"
                />
              </span>
            </div>
            <div className="actual">
              <p>Actual Result</p>
              <span>{results.fastestLap}</span>
            </div>
            {predictions.fastestLap === results.fastestLap && <div className="points">+8 points</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaceResults; 