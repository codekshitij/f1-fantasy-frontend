import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./LandingPage.css";
import RaceTrack from "../components/RaceTrack";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const audioRef = useRef(null);
  const calendarRef = useRef(null); // 🔁 Ref to scroll
  const [races, setRaces] = useState([]);
  const navigate = useNavigate();


  const handleSignupClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = 0.5;
      const playAudio = () => {
        audioElement.play().catch((error) => {
          console.log("Autoplay blocked:", error);
        });
      };
      document.addEventListener("click", playAudio, { once: true });
      document.addEventListener("touchstart", playAudio, { once: true });
      playAudio();

  
    }
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    const fetchRaceCalendar = async () => {
      try {
        const res = await axios.get("https://ergast.com/api/f1/2024.json");
        setRaces(res.data.MRData.RaceTable.Races);
      } catch (err) {
        console.error("Error fetching races:", err);
      }
    };
    fetchRaceCalendar();
  }, []);

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="landing-container">
        <audio ref={audioRef} src="/audio/race-start.mp3" preload="auto" />
        <video className="video-bg" autoPlay loop muted>
          <source src="/videos/f1-race.mp4" type="video/mp4" />
        </video>

        <div className="content">
          <h1 className="hero-text">
            Be The<span className="hero-highlight"> TEAM PRINCIPAL!</span> <br /> Of Your Own F1 Team
          </h1>

          <div className="buttons-container">
            <button className="btn btn-red" onClick={handleSignupClick}>Sign Up</button>
            <button className="btn btn-gray">View Leaderboard</button>
            <button className="btn btn-blue" onClick={scrollToCalendar}>
              View Race Calendar
            </button>
          </div>
        </div>
      </div>

      {/* 🔽 Race calendar section to scroll to */}
      <div ref={calendarRef} className="calendar-section bg-black text-white py-16">
        <RaceTrack races={races} />
      </div>
    </>
  );
};

export default LandingPage;
