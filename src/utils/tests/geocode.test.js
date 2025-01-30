import { getCoordinates } from '../geocode';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getCoordinates', () => {
  it('returns correct coordinates and city name for a valid location', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            geometry: { lat: 52.52, lng: 13.41 },
            components: { city: 'Berlin', country: 'Germany' },
          },
        ],
      }),
    });

    const result = await getCoordinates('Berlin');

    expect(result).toEqual({
      name: 'Berlin',
      lat: 52.52,
      lon: 13.41,
      country: 'Germany',
    });
  });

  it('returns null if the API request fails', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network error'));

    const result = await getCoordinates('Berlin');

    expect(result).toBeNull();
  });

  it('returns null if no location data is found', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    const result = await getCoordinates('Unknown City');

    expect(result).toBeNull();
  });

  it('correctly selects city name from available location data', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            geometry: { lat: 40.71, lng: -74.01 },
            components: { town: 'Manhattan', country: 'United States' },
          },
        ],
      }),
    });

    const result = await getCoordinates('New York');

    expect(result).toEqual({
      name: 'Manhattan',
      lat: 40.71,
      lon: -74.01,
      country: 'United States',
    });
  });

  it('falls back to the searched city name if no city/town/village is provided in response', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          {
            geometry: { lat: 35.68, lng: 139.76 },
            components: { country: 'Japan' }, // No city/town/village
          },
        ],
      }),
    });

    const result = await getCoordinates('Tokyo');

    expect(result).toEqual({
      name: 'Tokyo',
      lat: 35.68,
      lon: 139.76,
      country: 'Japan',
    });
  });
});
