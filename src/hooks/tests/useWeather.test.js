import { renderHook, waitFor } from '@testing-library/react';
import useWeather from '../useWeather';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useWeather Hook', () => {
  it('fetches temperature and updates state', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ current_weather: { temperature: 25 } }),
    });

    const { result } = renderHook(() => useWeather(52, 13));

    await waitFor(() => expect(result.current.temperature).toBe(25));
  });

  it('sets an error if API request fails', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to fetch weather data'));

    const { result } = renderHook(() => useWeather(52, 13));

    await waitFor(() =>
      expect(result.current.error).toBe('Failed to fetch weather data')
    );
  });

  it('sets an error if API response is missing weather data', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useWeather(52, 13));

    await waitFor(() =>
      expect(result.current.error).toBe('Invalid weather data received')
    );
  });
});
