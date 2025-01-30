import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { getCoordinates } from '../utils/geocode';

jest.mock('../utils/geocode', () => ({
  getCoordinates: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(globalThis, 'fetch').mockImplementation((url, options) => {
    if (url.includes('/locations') && options?.method === 'POST') {
      const requestBody = JSON.parse(options.body);

      if (requestBody.name === 'Berlin') {
        return Promise.resolve({
          json: () =>
            Promise.resolve({ error: 'Berlin is already in your list.' }),
          status: 400,
        });
      }

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: Math.floor(Math.random() * 1000),
            name: requestBody.name,
            lat: requestBody.lat,
            lon: requestBody.lon,
            country: requestBody.country,
          }),
      });
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, name: 'Berlin', lat: 52.52, lon: 13.41, country: 'Germany' },
          {
            id: 2,
            name: 'London',
            lat: 51.51,
            lon: -0.13,
            country: 'United Kingdom',
          },
        ]),
    });
  });

  jest.clearAllMocks();
});

afterEach(() => {
  globalThis.fetch.mockRestore();
});

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});

describe('Weather App', () => {
  it('displays default locations when the app loads', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument();
      expect(screen.getByText('London')).toBeInTheDocument();
    });
  });

  it('adds a new location when a valid city is entered', async () => {
    getCoordinates.mockResolvedValue({
      name: 'Test City',
      lat: 1,
      lon: 1,
      country: 'Testland',
    });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter city name'), {
      target: { value: 'Test City' },
    });

    fireEvent.click(screen.getByText('Add Location'));

    await waitFor(() => {
      expect(screen.getByText('Test City')).toBeInTheDocument();
    });
  });

  it('shows an error when an invalid city is entered', async () => {
    getCoordinates.mockResolvedValue(null);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Enter city name'), {
      target: { value: 'Unknown City' },
    });

    fireEvent.click(screen.getByText('Add Location'));

    await waitFor(() => {
      expect(
        screen.getByText('City not found. Please try a different name.')
      ).toBeInTheDocument();
    });
  });

  it('prevents adding a duplicate location and displays an error message', async () => {
    getCoordinates.mockResolvedValue({
      name: 'Berlin',
      lat: 52.52,
      lon: 13.41,
      country: 'Germany',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Enter city name'), {
      target: { value: 'Berlin' },
    });

    fireEvent.click(screen.getByText('Add Location'));

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Berlin is already'))
      ).toBeInTheDocument();
    });
  });

  it('removes a location when the delete button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Remove')[0]);

    await waitFor(() => {
      expect(screen.queryByText('Berlin')).not.toBeInTheDocument();
    });
  });
});
