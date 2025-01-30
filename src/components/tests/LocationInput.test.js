import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationInput from '../LocationInput';

describe('LocationInput Component', () => {
  it('renders the input field and add location button', () => {
    render(<LocationInput addLocation={jest.fn()} />);
    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByText('Add Location')).toBeInTheDocument();
  });

  it('calls addLocation when a city name is entered and the button is clicked', () => {
    const addLocationMock = jest.fn();
    render(<LocationInput addLocation={addLocationMock} />);

    fireEvent.change(screen.getByPlaceholderText('Enter city name'), {
      target: { value: 'Berlin' },
    });

    fireEvent.click(screen.getByText('Add Location'));

    expect(addLocationMock).toHaveBeenCalledWith('Berlin');
  });
});
