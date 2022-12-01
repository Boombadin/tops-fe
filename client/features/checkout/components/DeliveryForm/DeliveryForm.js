import React from 'react';
import { HideDesktop } from '@central-tech/core-ui';
import styled, { css } from 'styled-components';
import pt from 'prop-types';
import { get, isEmpty } from 'lodash';
import DeliveryTabs from './DeliveryTabs';
import HomeDelivery from './HomeDelivery';
import ClickAndCollect from './ClickAndCollect';
import withLocales from '../../../../hoc/withLocales';
import { getDefaultShipping } from '../../utils';

const MobileDeliveryOptionDescriptionText = styled.div`
  font-size: 11px;
  color: #666666;
  background: #fbfbfb;
  border-bottom: dashed 1px #e8e8e8;
  padding: 7px 20px;
  display: none;
  ${props =>
    props.isShow &&
    `
      display: block
    `}
`;

class DeliveryForm extends React.Component {
  state = {
    deliveryMethod: 'home_delivery',
    shippingMethod: 'mds',
    defaultShipping: null,
    currentIntervalIndex: 0,
    isRequestTax: false,
    currentSlotId: '',
    collector: null,
    isFirstLoad: true
  };

  componentDidMount() {
    if (this.state.isFirstLoad && !isEmpty(this.props.shippingAddress)) {
      this.setState({
        deliveryMethod: get(this.props.shippingAddress, 'shipping_method') === 'pickup' ? 'click_and_collect' : 'home_delivery',
        defaultShipping: this.props.shippingAddress,
        isFirstLoad: false
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      deliveryMethod,
      defaultShipping
    } = this.state;

    if (nextState.deliveryMethod !== deliveryMethod) {
      return true
    }
    if (nextState.defaultShipping !== defaultShipping) {
      return true
    }

    return false;
  };

  handleDeliveryClick = method => {
    this.setState({
      deliveryMethod: method,
      shippingMethod: 'tops',
    });

    // clear slot
    this.props.onDeleteDeliverySlot();
  };

  handleAddress = (type, data) => {
    // console.log(`${type} address...`, data)
  };

  handleShippingMethod = method => {
    this.setState({
      shippingMethod: method,
    });
  };

  render() {
    const { deliveryMethod, defaultShipping } = this.state;
    const {
      shippingAddress,
      billingAddress,
      cart,
      translate,
      onTaxRequestChange,
    } = this.props;
    return (
      <React.Fragment>
        <DeliveryTabs
          deliveryMethod={deliveryMethod}
          onClick={this.handleDeliveryClick}
          translate={translate}
        />

        {deliveryMethod === 'home_delivery' && (
          <HomeDelivery
            deliveryMethod={deliveryMethod}
            cart={cart}
            billingAddress={billingAddress}
            onShippingChange={this.handleShippingMethod}
            onTaxRequestChange={onTaxRequestChange}
          />
        )}

        {deliveryMethod === 'click_and_collect' && (
          <ClickAndCollect
            deliveryMethod={deliveryMethod}
            shippingAddress={shippingAddress}
            billingAddress={billingAddress}
            cart={cart}
            defaultShipping={defaultShipping}
            onClick={() => this.handleDeliveryClick('click_and_collect')}
            onTaxRequestChange={onTaxRequestChange}
          />
        )}
      </React.Fragment>
    );
  }
}

DeliveryForm.propTypes = {
  shippingAddress: pt.object,
  billingAddress: pt.object,
  cart: pt.object,
};

DeliveryForm.defaultProps = {
  shippingAddress: {},
  billingAddress: {},
  cart: {},
};

export default withLocales(DeliveryForm);
