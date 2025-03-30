import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faTrophy, 
  faUsers, 
  faPlus, 
  faCopy,
  faUserPlus,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import "./Leagues.css";

const Leagues = () => {
  const navigate = useNavigate();
  const [userLeagues, setUserLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inviteCode: "",
  });

  useEffect(() => {
    fetchUserLeagues();
  }, []);

  const fetchUserLeagues = async () => {
    try {
      const response = await axios.get("/fantasy/leagues/me");
      setUserLeagues(response.data);
      if (response.data.length > 0) {
        setSelectedLeague(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching leagues:", error);
      setError("Failed to load leagues");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/fantasy/leagues", {
        name: formData.name,
        description: formData.description,
      });
      setSuccess("League created successfully!");
      setUserLeagues([...userLeagues, response.data]);
      setSelectedLeague(response.data);
      setShowCreateForm(false);
      setFormData({ name: "", description: "", inviteCode: "" });
    } catch (error) {
      console.error("Error creating league:", error);
      setError(error.response?.data?.detail || "Failed to create league");
    }
  };

  const handleJoinLeague = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/fantasy/leagues/join", {
        inviteCode: formData.inviteCode,
      });
      setSuccess("Joined league successfully!");
      setUserLeagues([...userLeagues, response.data]);
      setSelectedLeague(response.data);
      setShowJoinForm(false);
      setFormData({ name: "", description: "", inviteCode: "" });
    } catch (error) {
      console.error("Error joining league:", error);
      setError(error.response?.data?.detail || "Failed to join league");
    }
  };

  const copyInviteCode = () => {
    if (selectedLeague?.inviteCode) {
      navigator.clipboard.writeText(selectedLeague.inviteCode);
      setSuccess("Invite code copied to clipboard!");
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="leagues-container">
      <div className="header-top">
        <button className="back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} className="btn-icon" />
          Back to Dashboard
        </button>
        <h1>Leagues</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="leagues-content">
        <div className="leagues-sidebar">
          <div className="leagues-actions">
            <button className="action-btn create" onClick={() => setShowCreateForm(true)}>
              <FontAwesomeIcon icon={faPlus} className="btn-icon" />
              Create League
            </button>
            <button className="action-btn join" onClick={() => setShowJoinForm(true)}>
              <FontAwesomeIcon icon={faUserPlus} className="btn-icon" />
              Join League
            </button>
          </div>

          <div className="leagues-list">
            <h3>Your Leagues</h3>
            {userLeagues.map((league) => (
              <div
                key={league.id}
                className={`league-item ${selectedLeague?.id === league.id ? "selected" : ""}`}
                onClick={() => setSelectedLeague(league)}
              >
                <FontAwesomeIcon icon={faTrophy} className="league-icon" />
                <div className="league-info">
                  <h4>{league.name}</h4>
                  <p>{league.members} members</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="league-details">
          {selectedLeague ? (
            <>
              <div className="league-header">
                <h2>{selectedLeague.name}</h2>
                <p className="league-description">{selectedLeague.description}</p>
                <div className="league-stats">
                  <div className="stat">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{selectedLeague.members} Members</span>
                  </div>
                  <button className="invite-btn" onClick={copyInviteCode}>
                    <FontAwesomeIcon icon={faCopy} />
                    Copy Invite Code
                  </button>
                </div>
              </div>

              <div className="league-standings">
                <h3>
                  <FontAwesomeIcon icon={faChartLine} />
                  League Standings
                </h3>
                <div className="standings-table">
                  <div className="table-header">
                    <span className="rank">Rank</span>
                    <span className="player">Player</span>
                    <span className="points">Points</span>
                    <span className="predictions">Correct Predictions</span>
                  </div>
                  {selectedLeague.standings?.map((player, index) => (
                    <div key={player.id} className="table-row">
                      <span className="rank">{index + 1}</span>
                      <span className="player">{player.username}</span>
                      <span className="points">{player.points}</span>
                      <span className="predictions">{player.correctPredictions}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="no-league-selected">
              <FontAwesomeIcon icon={faTrophy} className="empty-icon" />
              <h3>Select a league or create a new one</h3>
              <p>Join the competition and predict race results with friends!</p>
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New League</h2>
            <form onSubmit={handleCreateLeague}>
              <div className="form-group">
                <label>League Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showJoinForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Join League</h2>
            <form onSubmit={handleJoinLeague}>
              <div className="form-group">
                <label>Invite Code</label>
                <input
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowJoinForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Join League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leagues; 