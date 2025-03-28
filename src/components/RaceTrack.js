import React from "react";
import { countryCodeMap } from "../utils/countryCodeMap";
import "./RaceTrack.css";

const RaceTrack = ({ races }) => {
  return (
    <div className="race-track-container">
      <div className="calendar-heading">
        <span className="heading-left">🏁 2025 F1</span>
        <span className="heading-right">Calendar</span>
      </div>

      <div className="track-line-container">
        <div className="solid-line" />
        <div className="dashed-line" />
      </div>

      <div className="races-wrapper">
        {races.map((race, index) => {
          const { raceName, date, round, Circuit, Sprint } = race;
          const { circuitName, Location } = Circuit;
          const { locality, country } = Location;
          const isLeft = index % 2 === 0;
          const isSprint = Boolean(Sprint);
          const countryCode = countryCodeMap[country] || "";
          const flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

          return (
            <div
              key={round}
              className={`race-card ${isLeft ? "left" : "right"} ${isSprint ? "sprint-weekend" : ""}`}
            >
              {isLeft ? (
                <>
                  <div className="race-details">
                    <p className="race-date">
                       <strong>{new Date(date).toDateString()}</strong>
                      {isSprint && <span className="sprint-icon"> ⚡</span>}
                    </p>
                    <h3 className="race-title">
                      {raceName} {isSprint && <span className="sprint-label">Sprint</span>}
                    </h3>
                    <p className="race-sub">{circuitName}</p>
                    <p className="race-location">📍 {locality}, {country}</p>
                  </div>
                  <img src={flagUrl} alt={country} className="flag" />
                </>
              ) : (
                <>
                  <img src={flagUrl} alt={country} className="flag" />
                  <div className="race-details">
                    <p className="race-date">
                       <strong>{new Date(date).toDateString()}</strong>
                      {isSprint && <span className="sprint-icon"> ⚡</span>}
                    </p>
                    <h3 className="race-title">
                      {raceName} {isSprint && <span className="sprint-label">Sprint</span>}
                    </h3>
                    <p className="race-sub">{circuitName}</p>
                    <p className="race-location">📍 {locality}, {country}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RaceTrack;
