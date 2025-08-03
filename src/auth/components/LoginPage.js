import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { firestoreService } from "../services/firebaseAuth";
import "./LoginPage.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Use the main auth hook for complete state management
  const { user, login: authLogin } = useAuth();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (user) {
        console.log('🔍 Checking user profile and teams...');
        
        if (!user.firestoreUser?.profileCompleted) {
          console.log('📝 Profile not completed, redirecting to complete profile');
          navigate("/complete-profile", { replace: true });
          return;
        }

        try {
          // Check if user has fantasy teams using Firestore
          const teams = await firestoreService.getUserTeams(user.uid);
          console.log('🏎️ User teams:', teams);
          
          if (teams.length > 0) {
            console.log('✅ User has teams, redirecting to dashboard');
            navigate("/dashboard", { replace: true });
          } else {
            console.log('➕ No teams found, redirecting to create team');
            navigate("/create-team", { replace: true });
          }
        } catch (error) {
          console.error('❌ Error checking teams:', error);
          navigate("/dashboard", { replace: true });
        }
      }
    };

    checkUserAndRedirect();
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('📧 Attempting email login...');
      // Use the auth context login method with email credentials
      await authLogin("email", { email, password });
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error('❌ Email login failed:', err);
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log('🔐 Attempting Google login...');
      // Use the auth context login method for Google
      await authLogin("google");
      // Navigation will be handled by the useEffect above
    } catch (err) {
      console.error('❌ Google login failed:', err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, show loading
  if (user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🏎️</div>
        <p>Redirecting...</p>
      </div>
    );
  }

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

        <form className="login-form" onSubmit={handleEmailLogin}>
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

          <button type="submit" className="login-btn" disabled={isLoading}>
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

export default Login;
