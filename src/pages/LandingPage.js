import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Import CSS file

const LandingPage = () => {
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const audioElement = audioRef.current; // ✅ Store ref in a variable

    if (audioElement) {
      audioElement.volume = 0.5;
      const playAudio = () => {
        audioElement.play().catch((error) => {
          console.log("Autoplay blocked by browser:", error);
        });
      };

      document.addEventListener("click", playAudio, { once: true });
      document.addEventListener("touchstart", playAudio, { once: true });

      playAudio();
    }

    // ✅ Cleanup function with stable reference
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []); // Dependency array remains empty

  return (
    <div className="landing-container">
      {/* 🎵 Audio Element (Only on Landing Page) */}
      <audio ref={audioRef} src="/audio/race-start.mp3" preload="auto" />

      {/* 🔹 Background Video */}
      <video className="video-bg" autoPlay loop muted>
        <source src="/videos/f1-race.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Centered Content */}
      <div className="content">
        {/* 🔹 Hero Text */}
        <h1 className="hero-text">
          Be The<span className="hero-highlight"> TEAM PRINCIPAL!</span> <br /> Of Your Own F1 Team
        </h1>

        {/* 🔹 Buttons Moved Below the Text */}
        <div className="buttons-container">
          <button className="btn btn-red" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className="btn btn-gray">View Leaderboard</button>
          <button className="btn btn-blue">How It Works</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
