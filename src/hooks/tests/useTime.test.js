import { renderHook, waitFor } from '@testing-library/react';
import useTime from '../useTime';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useTime Hook', () => {
  it('returns the correct local time from API', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ dateTime: '2024-01-29T14:30:00Z' }),
    });

    const { result } = renderHook(() => useTime(52, 13));

    await waitFor(() => expect(result.current.localTime).toBe('14:30'));
  });

  it('returns an error message when API request fails', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failed to fetch time data'));

    const { result } = renderHook(() => useTime(52, 13));

    await waitFor(() =>
      expect(result.current.error).toBe('Failed to fetch time data')
    );
  });

  it('returns an error message if API response is missing time data', async () => {
    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useTime(52, 13));

    await waitFor(() =>
      expect(result.current.error).toBe('Invalid time data received from API')
    );
  });

  it('updates the local time every minute', async () => {
    jest.useFakeTimers();

    globalThis.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ dateTime: '2024-01-29T14:30:00Z' }),
    });

    const { result } = renderHook(() => useTime(52, 13));

    await waitFor(() => expect(result.current.localTime).toBe('14:30'));

    jest.advanceTimersByTime(60 * 1000);

    await waitFor(() => expect(result.current.localTime).toBe('14:31'));

    jest.useRealTimers();
  });
});
