import { useState, useEffect } from 'react';

// Hook to fetch local time data based on coordinates
const useTime = (latitude, longitude) => {
  const [localTime, setLocalTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    let fetchIntervalId;

    const fetchTime = () => {
      fetch(
        `https://www.timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch time data. Status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          if (!data.dateTime) {
            throw new Error('Invalid time data received from API');
          }

          setLocalTime(new Date(data.dateTime));
        })
        .catch((err) => {
          console.error('Error fetching time data:', err);
          setError(err.message || 'Unable to fetch local time');
        });
    };

    fetchTime();

    // Fetch new time from API every 10 minutes
    fetchIntervalId = setInterval(fetchTime, 10 * 60 * 1000);

    // Increment time every minute locally
    intervalId = setInterval(() => {
      setLocalTime((prevTime) =>
        prevTime ? new Date(prevTime.getTime() + 60 * 1000) : null
      );
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(fetchIntervalId);
    };
  }, [latitude, longitude]);

  const formattedTime = localTime
    ? new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(localTime)
    : 'Loading...';

  return { localTime: formattedTime, error };
};

export default useTime;
