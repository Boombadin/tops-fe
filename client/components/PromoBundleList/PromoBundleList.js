import { find, get } from 'lodash';
import React, { Component } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import '@client/components/PromoBundleList/PromoBundleList.scss';

class PromoBundleList extends Component {
  state = {
    currentDel: false,
  };

  renderBundleList = () => {
    const { promoNo, itemsBundle } = this.props;
    const activeBundle = find(
      itemsBundle,
      item => get(item, 'name', '') === promoNo.toString(),
    );

    const component = [];

    if (activeBundle) {
      const qtyStep = get(activeBundle, 'qty_step', 0);
      const items = get(activeBundle, 'items', []);
      const itemLength = get(activeBundle, 'items', []).length;
      let mainRound = Math.ceil(itemLength / qtyStep);

      if (itemLength % qtyStep === 0) {
        mainRound += 1;
      }

      for (let scropRound = 0; scropRound < mainRound; scropRound++) {
        for (let itemRound = 0; itemRound < qtyStep; itemRound++) {
          const currentIndex = itemRound + qtyStep * scropRound;

          if (items[currentIndex]) {
            component.push(
              <div
                className={`promo-bundle-list--item ${
                  this.state.currentDel === currentIndex ? 'deleting' : ''
                }`}
              >
                <img src={items[currentIndex].imageUrl} alt="" />
              </div>,
            );
          } else {
            component.push(<div className="promo-bundle-list--item blank" />);
          }
        }
        component.push(<div className="promo-bundle-list--line" />);
      }
    }

    return component;
  };

  render() {
    return (
      <div className="promo-bundle-list--root">{this.renderBundleList()}</div>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  itemsBundle: state.cart.itemsBundle,
  itemsExcludeBundle: state.cart.itemsExcludeBundle,
  payment: state.checkout.payment,
  cartBundle: state.cart.bundle,
  cartItems: state.cart.items,
  storeConfig: state.storeConfig.current,
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(PromoBundleList);
