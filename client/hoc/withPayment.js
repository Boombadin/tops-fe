import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  fetchCartProducts,
  transferCart,
  updateDiffCartItems,
} from '@client/reducers/cart';
import { createOrder, validateDeliverySlot } from '@client/reducers/checkout';
import { fullPageLoading } from '@client/reducers/layout';
import { fetchStoreConfigCurrent } from '@client/reducers/storeConfig';

const withPayment = WrappedComponent => {
  class HoC extends React.PureComponent {
    render() {
      const { children, customer, ...props } = this.props;

      return (
        <WrappedComponent {...props} customer={customer || {}}>
          {children}
        </WrappedComponent>
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(HoC);
};

const mapStateToProps = state => ({
  customer: state.customer.items,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchCartProducts,
      updateDiffCartItems,
      validateDeliverySlot,
      createOrder,
      fetchStoreConfigCurrent,
      fullPageLoading,
      transferCart,
    },
    dispatch,
  );
};

export default withPayment;
