import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDeliveryToolBar, closeDeliveryToolBar, setAddressDefault } from '../reducers/customer';

const withCustomer = WrappedComponent => {
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

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(HoC);
};

const mapStateToProps = state => ({
  customer: state.customer.items,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      showDeliveryToolBar,
      closeDeliveryToolBar,
      setAddressDefault
    },
    dispatch,
  );
};

export default withCustomer;
