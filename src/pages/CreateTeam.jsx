import './CreateTeam.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTeam = () => {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedConstructor, setSelectedConstructor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverResponse = await fetch("https://ergast.com/api/f1/2024/drivers.json");
        const constructorResponse = await fetch("https://ergast.com/api/f1/2024/constructors.json");
  
        const driverData = await driverResponse.json();
        const constructorData = await constructorResponse.json();
  
        const driversList = driverData.MRData.DriverTable.Drivers;
        const constructorsList = constructorData.MRData.ConstructorTable.Constructors;
  
        console.log("Fetched Drivers:", driversList);
        console.log("Fetched Constructors:", constructorsList);
  
        setDrivers(driversList);
        setConstructors(constructorsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDriverChange = (event) => {
    const selectedDriverId = event.target.value;
    if (selectedDrivers.includes(selectedDriverId)) {
      setSelectedDrivers(selectedDrivers.filter(id => id !== selectedDriverId));
    } else if (selectedDrivers.length < 5) {
      setSelectedDrivers([...selectedDrivers, selectedDriverId]);
    } else {
      alert('You can only select up to 5 drivers.');
    }
  };

  const handleConstructorChange = (event) => {
    setSelectedConstructor(event.target.value);
  };

  return (

    console.log("Drivers:", drivers),
    console.log("Constructors:", constructors),

    <div className="create-team-container">
      <h1 className="create-team-header">🛠️ Build Your Race Team</h1>

      <div className="team-selection-area">
        {/* Drivers Selection */}
        <div className="selection-section">
          <h3>🏎️ Choose Drivers (Select up to 5)</h3>
          <select multiple value={selectedDrivers} onChange={handleDriverChange}>
            {drivers.map(driver => (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.givenName} {driver.familyName}
              </option>
            ))}
          </select>
          <p>Selected Drivers: {selectedDrivers.length}/5</p>
        </div>

        {/* Constructor Selection */}
        <div className="selection-section">
          <h3>🏁 Choose Constructor</h3>
          <select value={selectedConstructor} onChange={handleConstructorChange}>
            <option value="">Select a constructor</option>
            {constructors.map(constructor => (
              <option key={constructor.constructorId} value={constructor.constructorId}>
                {constructor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        className="confirm-button"
        disabled={selectedDrivers.length !== 5 || !selectedConstructor}
      >
        Confirm Team
      </button>
    </div>
  );
};

export default CreateTeam;
