import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UnitToggle from '../UnitToggle';

describe('UnitToggle', () => {
  it('displays the correct unit toggle button text based on the current unit', () => {
    render(<UnitToggle unit="C" toggleUnit={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Show in °F' })
    ).toBeInTheDocument();
  });

  it('calls the toggleUnit function when the button is clicked', () => {
    const toggleUnit = jest.fn();
    render(<UnitToggle unit="C" toggleUnit={toggleUnit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Show in °F' }));

    expect(toggleUnit).toHaveBeenCalledTimes(1);
  });
});
