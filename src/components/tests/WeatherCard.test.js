import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../WeatherCard';

jest.mock('../../hooks/useWeather', () => () => ({
  temperature: 20,
  error: null,
}));
jest.mock('../../hooks/useTime', () => () => ({
  localTime: '12:00',
  error: null,
}));

describe('WeatherCard', () => {
  const renderWeatherCard = () =>
    render(
      <WeatherCard
        name="Berlin"
        lat={52}
        lon={13}
        country="Germany"
        unit="C"
        onDelete={jest.fn()}
      />
    );

  it('displays the city name and country', () => {
    renderWeatherCard();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('displays the temperature in Celsius when the unit is set to C', () => {
    renderWeatherCard();
    expect(screen.getByText('Temperature: 20.0°C')).toBeInTheDocument();
  });

  it('displays the current local time for the city', () => {
    renderWeatherCard();
    expect(screen.getByText('Local Time: 12:00')).toBeInTheDocument();
  });
});
