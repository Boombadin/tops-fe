import { render, screen } from '@testing-library/react';
import React from 'react';

import ButtonRadio from '../ButtonRadio';

describe('Component : ButtonRadio', () => {
  const props = {
    name: 'radio',
    label: 'textRadio',
    onChange: jest.fn(),
    checked: null,
    readOnly: null,
  };
  test('Render radio button', () => {
    const { asFragment } = render(<ButtonRadio {...props} />);
    expect(screen.getByText('textRadio')).toBeInTheDocument();
    expect(asFragment(<ButtonRadio {...props} />)).toMatchSnapshot();
  });
  test('Render radio button', () => {
    const props = {
      name: 'radio',
      label: 'textRadio',
      onChange: jest.fn(),
    };
    const { asFragment } = render(<ButtonRadio {...props} />);
    expect(screen.getByText('textRadio')).toBeInTheDocument();
    expect(asFragment(<ButtonRadio {...props} />)).toMatchSnapshot();
  });
  test('checked radio button', () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('checked', true);
    expect(input).toHaveAttribute('checked', 'true');
    input.setAttribute('checked', false);
    expect(input).toHaveAttribute('checked', 'false');
  });
});
