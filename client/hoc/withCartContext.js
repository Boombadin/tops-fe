import PropTypes from 'prop-types';
import React from 'react';

import { CartContext } from '@client/contexts';

const withCartContext = WrappedComponent => props => {
  return (
    <CartContext.Consumer>
      {contextValue => <WrappedComponent {...contextValue} {...props} />}
    </CartContext.Consumer>
  );
};

withCartContext.propTypes = {
  WrappedComponent: PropTypes.node.isRequired,
};

export default withCartContext;
