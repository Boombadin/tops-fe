import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addAddress, editAddress, deleteAddress } from '../reducers/customer';

const withAddress = WrappedComponent => {
  class HoC extends React.PureComponent {
    render() {
      const {
        addAddress,
        addresses,
        deleteAddress,
        editAddress,
        ...props
      } = this.props;
      const defaultShipping = get(addresses, '0', {}); //TODO: use address id from customer new value to select address instend of default shipping in address is it exist;

      return (
        <WrappedComponent
          {...props}
          defaultShipping={defaultShipping}
          addresses={addresses}
          addAddress={addAddress}
          editAddress={editAddress}
          deleteAddress={deleteAddress}
        />
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(HoC);
};

const mapStateToProps = state => ({
  addresses: get(state, 'customer.items.addresses', []),
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addAddress: addAddress,
      editAddress: editAddress,
      deleteAddress: deleteAddress,
    },
    dispatch,
  );
};

export default withAddress;
