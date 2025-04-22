// src/hooks/useTime.js
import { useState, useEffect } from 'react';

// Hook to fetch local time data based on coordinates
const useTime = (latitude, longitude) => {
  const [localTime, setLocalTime] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let tickInterval;
    let initialTimeout;
    let fetcher;

    const fetchTime = async () => {
      try {
        const res = await fetch(
          `https://www.timeapi.io/api/Time/current/coordinate?latitude=${latitude}&longitude=${longitude}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch time (status ${res.status})`);
        }
        const data = await res.json();
        if (!data.dateTime) {
          throw new Error('Invalid time data received');
        }

        // define newTime here
        const newTime = new Date(data.dateTime);
        setLocalTime(newTime);
        setError(null);

        // clear any existing timers
        clearTimeout(initialTimeout);
        clearInterval(tickInterval);

        // compute ms until the next real clock minute
        const now = newTime;
        const msUntilNextMinute =
          (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // schedule the first tick exactly on the next :00
        initialTimeout = setTimeout(() => {
          setLocalTime((prev) => new Date(prev.getTime() + 60000));
          tickInterval = setInterval(() => {
            setLocalTime((prev) => new Date(prev.getTime() + 60000));
          }, 60000);
        }, msUntilNextMinute);
      } catch (err) {
        console.error('Error fetching time data:', err);
        setError(err.message || 'Unable to fetch time');
      }
    };

    // initial fetch + 10‑minute re‑sync
    fetchTime();
    fetcher = setInterval(fetchTime, 10 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(tickInterval);
      clearInterval(fetcher);
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
