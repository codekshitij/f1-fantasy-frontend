import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import ProfileModal from "../components/ProfileModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./SignupPage.css"; // ✅ Ensure CSS is applied

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState(null);
  const navigate = useNavigate();

  // ✅ Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // ✅ Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/auth/signup", { email, password });
      const userData = response.data;

      // ✅ Save token
      localStorage.setItem("token", userData.access_token);

      // ✅ Open profile modal if profile details are missing
      setNewUserData({ email });
      setIsProfileModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  // ✅ Handle Profile Save
  const handleProfileSave = async (profileData) => {
    try {
        console.log("Profile Data Before Save:", profileData);  // Debug log

        const token = localStorage.getItem("token");

        await axios.put("/auth/complete-profile", profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Save profile data locally after signup
        localStorage.setItem("userProfile", JSON.stringify(profileData));

        console.log("Profile saved in Local Storage:", localStorage.getItem("userProfile"));

        // ✅ Close Modal & Redirect
        setIsProfileModalOpen(false);
        navigate("/dashboard");
    } catch (error) {
        console.error("Error saving profile:", error);
        setError("Failed to save profile.");
    }
};

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url("/images/F1.png")`, // ✅ Background set inline
      }}
    >
      <div className="signup-form-container">
        <h2 className="signup-title">Create an Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form className="signup-form" onSubmit={handleSignup}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <hr className="divider" />

        {/* ✅ Profile Modal - Opens After Signup */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          email={newUserData?.email}
          onClose={() => navigate("/dashboard")}
          onSave={handleProfileSave}
        />
      </div>
    </div>
  );
};

export default SignupPage;
