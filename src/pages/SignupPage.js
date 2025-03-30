import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "./SignupPage.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Handle Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/auth/signup", { name, email, password });
      const userData = response.data;

      // Save token
      localStorage.setItem("token", userData.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    try {
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();

      // Send the token to your backend
      const response = await axios.post("/auth/google-login", {
        token: idToken
      });

      const { access_token } = response.data;

      // Save the token
      localStorage.setItem("token", access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google signup error:", err);
      setError("Failed to sign up with Google");
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url("/images/F1.png")`,
      }}
    >
      <div className="signup-form-container">
        <h2 className="signup-title">Create an Account</h2>
        {error && <p className="error-message">{error}</p>}

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>

        <hr className="divider" />

        <button 
          className="google-btn"
          onClick={handleGoogleSignup}
        >
          <FontAwesomeIcon icon={faGoogle} className="google-icon" />
          Continue with Google
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <a href="/login" className="link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
