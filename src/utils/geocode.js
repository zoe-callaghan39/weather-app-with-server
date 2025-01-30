export const getCoordinates = (cityName) => {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=6fe20c614e5849e1ad489081dc9e3709`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch geocode data');
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error('No results found for this location');
      }

      const { lat, lng } = data.results[0].geometry;
      const components = data.results[0].components;
      const city =
        components.city || components.town || components.village || cityName;
      const country = components.country;

      return { name: city, lat, lon: lng, country };
    })
    .catch((err) => {
      console.error('Error in getCoordinates:', err);
      return null;
    });
};
