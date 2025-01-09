import { useState, useEffect } from "react";

// Hook to fetch local time data based on coordinates
const useTime = (latitude, longitude) => {
  const [localTime, setLocalTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchTime = async () => {
      try {
        const response = await fetch(
          `https://www.timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch time data. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setLocalTime(data.time);
      } catch (err) {
        console.error("Error fetching time data:", err);
        setError(err.message || "Unable to fetch local time");
      }
    };

    fetchTime();

    intervalId = setInterval(() => {
      fetchTime();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [latitude, longitude]);

  return { localTime, error };
};

export default useTime;
