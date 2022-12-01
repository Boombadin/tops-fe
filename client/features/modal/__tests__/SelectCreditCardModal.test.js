import { render } from '@testing-library/react';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '@client/config/theme';

import SelectCreditCardModal from '../SelectCreditCardModal';

jest.mock('@client/hoc/withLocales', () => {
  return Component => props => (
    <Component translate={jest.fn(key => key)} {...props} />
  );
});

const TEST_ID = {
  CONTAINER: 'inf-viewSelectCreditCardModal-Container',
};

describe('features/modal/SelectCreditCardModal', () => {
  const props = {
    openModal: true,
    onModalClose: () => {},
  };

  test('it should display text correctly', () => {
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <SelectCreditCardModal {...props} />
      </ThemeProvider>,
    );
    const popup = getByTestId(TEST_ID.CONTAINER);
    expect(popup).toBeInTheDocument();
  });
});
