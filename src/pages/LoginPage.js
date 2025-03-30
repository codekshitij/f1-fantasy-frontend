import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (!user.profile_completed) {
        navigate("/signup", { replace: true });
      } else if (!user.team) {
        navigate("/create-team", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      const userData = response.data;
      localStorage.setItem("access_token", userData.access_token);
      await login(userData.user);
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();

      // Send the token to your backend using our configured axios instance
      const response = await axios.post("/auth/google-login", { token: idToken });

      if (!response.data.access_token) {
        throw new Error("No access token received from backend");
      }

      // Store access token
      localStorage.setItem("access_token", response.data.access_token);
      
      if (!response.data.user) {
        throw new Error("No user data received from backend");
      }

      // Update auth context with user data
      await login(response.data.user);
      
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.detail || err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="login-container"
      style={{
        backgroundImage: `url("/images/F1.png")`,
      }}
    >
      <div className="login-form-container">
        <h2 className="login-title">Welcome Back</h2>
        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr className="divider" />

        <button 
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faGoogle} className="google-icon" />
          Continue with Google
        </button>

        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/signup" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
