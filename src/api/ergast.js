import axios from "axios";

export const fetchRaceCalendar = async () => {
  const response = await axios.get("https://ergast.com/api/f1/2025.json");
  return response.data.MRData.RaceTable.Races;
};
