import React, { useState } from "react";
import "./ProfileModal.css";

const teams = [
  "Mercedes", "Red Bull", "Ferrari", "McLaren", "Aston Martin",
  "Alpine", "Williams", "Haas", "Kick Sauber", "Visa CashApp Bull Racing"
];

// Avatar Options (Dropdown Selection)
const avatars = [
  { name: "Mercedes", url: "/avatars/avatars1.png" },
  { name: "Red Bull", url: "/avatars/avatars2.png" },
  { name: "Ferrari", url: "/avatars/avatars3.png" },
  { name: "McLaren", url: "/avatars/avatars4.png" },
  { name: "Aston Martin", url: "/avatars/avatars5.png" },
  { name: "Alpine", url: "/avatars/avatars6.png" },
  { name: "Williams", url: "/avatars/avatars7.png" },
  { name: "Haas", url: "/avatars/avatars8.png" },
  { name: "Kick Sauber", url: "/avatars/avatars9.png" },
  { name: "Visa CashApp Bull Racing", url: "/avatars/avatars10.png" }
];


const ProfileModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0].url);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  const handleSaveProfile = () => {
    const profileData = { 
      name, 
      username, 
      avatar_url: selectedAvatar, 
      team: selectedTeam 
    };

    console.log("Saved Profile Data:", profileData); // ✅ Debugging log
  
    onSave(profileData);
  };
  

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2 className="modal-title">Complete Your Profile</h2>

        {/* Name Input */}
        <label>Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter your name" 
        />

        {/* Username Input */}
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Choose a username" 
        />

        {/* Avatar Selection (Dropdown) */}
        <label>Choose an Avatar:</label>
        <select value={selectedAvatar} onChange={(e) => setSelectedAvatar(e.target.value)}>
          {avatars.map((avatar, index) => (
            <option key={index} value={avatar.url}>{avatar.name}</option>
          ))}
        </select>

        {/* Team Selection */}
        <label>Choose Your F1 Team:</label>
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          {teams.map((team, index) => (
            <option key={index} value={team}>{team}</option>
          ))}
        </select>

        {/* Buttons */}
        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSaveProfile}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
