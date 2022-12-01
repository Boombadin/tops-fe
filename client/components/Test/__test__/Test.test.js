import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Test from './../Test';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);
function reducer() {
  const state = { locale: { lang: 'th' } };
  return state;
}

function renderWithRedux(
  component,
  { initialState, store = createStore(reducer, initialState) } = {},
) {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
  };
}

describe('Link Unit Testing', () => {
  it('renders link correctly', () => {
    const { getByTestId } = renderWithRedux(<Test />);
    // expect(container.firstChild).toMatchSnapshot();
    expect(getByTestId('link-id')).toHaveTextContent('eiei');
  });
});
