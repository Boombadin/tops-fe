import { FullScreenLoading } from '@central-tech/core-ui';
import { get, isEmpty } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import CartItemsDifferentModal from '@client/features/modal/CartItemsDifferentModal';
import { fetchShippingMethods } from '@client/reducers/cart';
import { fetchCartProducts, transferCart } from '@client/reducers/cart';
import { deleteDeliverySlot } from '@client/reducers/checkout';
import { setAddressDefault } from '@client/reducers/customer';
import { closeDeliveryToolBar } from '@client/reducers/customer';
import { fullPageLoading } from '@client/reducers/layout';
import { fetchNextStoreConfig } from '@client/reducers/storeConfig';
import { countDiffItems } from '@client/utils/diffItemCheck';

import withLocales from './withLocales';

const withChangeStore = WrappedComponent => {
  const initialState = {
    openModalDiffCart: false,
    openStoreLocatorModal: false,
    diffItems: [],
    nextStoreCode: '',
    newAddress: {},
    loading: false,
  };
  class HoC extends React.PureComponent {
    state = initialState;

    componentDidMount() {
      this.setState({ ...initialState });
    }

    handleChangeStore = async (address, showSameAddressButton) => {
      const { cartItems, storeConfig, cart } = this.props;
      this.props.fullPageLoading(true, 'Loading...');
      this.setState({
        // loading: true,
        showSameAddressButton: showSameAddressButton,
      });

      let newAddress = address;

      const deliveryId = get(newAddress, 'id', '');
      let deliveryMethod = 'delivery';
      if (get(newAddress, 'extension_attributes.address')) {
        newAddress = get(newAddress, 'extension_attributes.address');
        newAddress.seller_code = address?.seller_code;
        deliveryMethod = 'pickup';
      }
      await this.props.deleteDeliverySlot(get(cart, 'id'));

      newAddress.delivery_method = deliveryMethod;

      const nextStoreCode = await this.props.fetchNextStoreConfig(newAddress);
      const { items: newCartProducts } = await this.props.fetchCartProducts(
        nextStoreCode,
      );
      const diffItems = countDiffItems(cartItems, newCartProducts, storeConfig);
      if (!isEmpty(address)) {
        this.setState({
          nextStoreCode: nextStoreCode,
          newAddress: {
            id: deliveryId,
            method: deliveryMethod,
          },
        });
      }

      if (!isEmpty(diffItems)) {
        this.props.fullPageLoading(false, 'Loading...');
        this.setState({
          openModalDiffCart: true,
          diffItems: diffItems,
          loading: false,
        });
      } else {
        this.handleTransferCart(true);
      }
    };

    handleTransferCart = async isTransfer => {
      const { storeConfig, cart, translate } = this.props;
      const { nextStoreCode, newAddress } = this.state;

      this.props.fullPageLoading(true, translate('store_changeing'));
      this.setState({
        loading: true,
      });

      await this.props.setAddressDefault(
        newAddress,
        'shipping',
        get(newAddress, 'method', ''),
        nextStoreCode,
      );

      this.props.fetchShippingMethods(get(cart, 'id'));

      if (get(storeConfig, 'code', '') === nextStoreCode) {
        this.setState({
          openModalDiffCart: false,
          loading: false,
        });
        window.location.reload(true);
        return;
      }

      if (isTransfer) {
        await this.props.transferCart({
          diffItems: this.state.diffItems,
          storeCode: nextStoreCode,
        });
        this.setState({ loading: false });
        this.props.closeDeliveryToolBar();
        window.location.reload(true);
      }
    };

    handleCloseTransfer = () => {
      this.setState({ ...initialState });
    };

    render() {
      const { ...props } = this.props;
      return (
        <React.Fragment>
          <WrappedComponent
            {...props}
            onChangeStore={this.handleChangeStore}
          ></WrappedComponent>
          <CartItemsDifferentModal
            open={this.state.openModalDiffCart}
            products={this.state.diffItems}
            close={() => this.handleCloseTransfer()}
            handleTransferCart={() => this.handleTransferCart(true)}
            isConfirm={this.state.showSameAddressButton || false}
          />
          {this.state.loading && (
            <FullScreenLoading
              icon="/assets/icons/loader-2.gif"
              width="100px"
              height="auto"
            />
          )}
        </React.Fragment>
      );
    }
  }

  return withLocales(connect(mapStateToProps, mapDispatchToProps)(HoC));
};

const mapStateToProps = state => ({
  cart: state.cart.cart,
  cartItems: state.cart.cart.items,
  storeConfig: state.storeConfig.current,
  nextStoreConfig: state.storeConfig.next,
});

const mapDispatchToProps = dispatch => ({
  fetchNextStoreConfig: nextAddress =>
    dispatch(fetchNextStoreConfig(nextAddress)),
  fetchCartProducts: useNextStoreConfig =>
    dispatch(fetchCartProducts(useNextStoreConfig)),
  transferCart: storeCode => dispatch(transferCart(storeCode)),
  fullPageLoading: (condition, message) =>
    dispatch(fullPageLoading(condition, message)),
  setAddressDefault: (id, type, method, storeCode) =>
    dispatch(setAddressDefault(id, type, method, storeCode)),
  fetchShippingMethods: cartId => dispatch(fetchShippingMethods(cartId)),
  deleteDeliverySlot: cartId => dispatch(deleteDeliverySlot(cartId)),
  closeDeliveryToolBar: () => dispatch(closeDeliveryToolBar()),
});

export default withChangeStore;
