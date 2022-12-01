import React, { Component } from 'react';
import { get as prop, find, head } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Check from '../../components/Icons/Check';
import Fireworks from '../../components/Icons/Fireworks';
import Cny from '../../components/Icons/Cny';
import './PromoBundleNotification.scss';
import { findIsSeasonal } from '../../utils/seasonalSelectors';
import { withCartItems, findIsNyb } from '../../features/nyb';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const Col = styled.div`
  flex-direction: column;
  flex: ${props => props.flex || 1};
`;
const Center = styled.div`
  text-align: center;
`;

class PromoBundleNotice extends Component {
  static propTypes = {
    translate: PropTypes.func.isRequired,
    carts: PropTypes.array.isRequired,
    cartInit: PropTypes.bool.isRequired,
    iconScale: PropTypes.number
  };

  static defaultProps = {
    iconScale: 1
  };

  state = {
    visible: false,
    isNyb: false,
    isSeasonal: false
  };

  componentDidUpdate(prevProps, prevState) {
    const { carts, cartInit } = this.props;
    const { visible } = this.state;
    if (!visible) {
      if (carts.length > prevProps.carts.length && prevProps.cartInit === cartInit) {
        this.handleAlert();
      }
    }
  }

  handleAlert = () => {
    const { carts, storeConfig, itemAddToCart } = this.props;

    const { visible } = this.state;
    const config = prop(storeConfig, 'extension_attributes.seasonal_badge');
    const seasonal = prop(head(config), 'code', '');

    if (!visible) {
      const isNyb = carts.every(pro => findIsNyb(pro) === true);
      const isSeasonal = findIsSeasonal(itemAddToCart, seasonal);

      this.setState({ visible: true, isNyb, isSeasonal });

      setTimeout(() => {
        this.setState({ visible: false, isNyb, isSeasonal });
      }, 3000);
    }
  };

  render() {
    const { translate, iconScale } = this.props;
    const { visible, isNyb, isSeasonal } = this.state;
    // Check Product Type
    const icon = isNyb ? (
      <Fireworks scale={iconScale} />
    ) : isSeasonal ? (
      <Cny scale={iconScale} />
    ) : (
      <Check scale={iconScale} />
    );
    const title = translate(
      isNyb ? 'notification.cart.nyb' : isSeasonal ? 'notification.cart.cny' : 'notification.cart.normal'
    );
    return (
      <div id="promo-bundle-notice" className={`promo-bundle-notice--container ${visible ? 'active' : ''}`}>
        <div className="title">
          <Row className="row">
            {icon}
            <div style={{ marginRight: 15 }} />
            <Col>
              <Center dangerouslySetInnerHTML={{ __html: title.replace('\n', '<br />') }} />
            </Col>
          </Row>
        </div>
        <div className="mobile-title">
          <Row className="row">
            {icon}
            <div style={{ marginRight: 15 }} />
            <Col>
              <Center dangerouslySetInnerHTML={{ __html: title.replace('\n', '<br />') }} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withCartItems(PromoBundleNotice);
