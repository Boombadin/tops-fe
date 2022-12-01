import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import NotifyTooltip from '@client/components/NotifyTooltip';
import { ProductList } from '@client/magenta-ui';
import { isCustomerLoggedSelector } from '@client/selectors';

import './PreloadedProductMini.scss';

class PreloadedProductMini extends PureComponent {
  static defaultProps = {
    products: [],
    onPreload: noop,
    sortingFunc: noop,
  };

  static propTypes = {
    products: PropTypes.array,
    storeConfig: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    onPreload: PropTypes.func,
    filterFunc: PropTypes.func.isRequired,
    cart: PropTypes.object.isRequired,
    sortingFunc: PropTypes.func,
  };

  componentDidMount() {
    this.handleLoadData();
  }

  handleLoadData = async () => {
    await this.props.onPreload();
  };

  render() {
    const {
      products,
      translate,
      storeConfig,
      filterFunc,
      cart,
      loadingCartProduct,
      ownProducts,
      sortingFunc,
      envConfig,
    } = this.props;

    let filteredProducts = [];
    if (filterFunc !== undefined) {
      filteredProducts = filter(ownProducts || products, filterFunc);
    } else {
      filteredProducts = filter(ownProducts || products);
    }

    if (sortingFunc) filteredProducts.sort(sortingFunc);

    filteredProducts = map(filteredProducts, product => ({
      ...product,
      qty: find(cart.items, item => item.sku === product.sku)?.qty || 0,
    }));

    return (
      <ProductList
        id="product-mini"
        type="mini"
        products={filteredProducts}
        baseMediaUrl={`${storeConfig.base_media_url}catalog/product`}
        addToCartLabel={translate('product.add_to_cart')}
        outOfStockLabel={translate('product.out_of_stock')}
        priceLabel={translate('product_list.price_label')}
        saveLabel={translate('product.save')}
        unitLabel={translate('unit.baht')}
        loadingCartProduct={loadingCartProduct}
        NotifyTooltipComponent={NotifyTooltip}
        environment={envConfig.env}
      />
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  loadingCartProduct: state.cart.loadingProduct,
  products: state.product.items,
  storeConfig: state.storeConfig.current,
  translate: getTranslate(state.locale),
  customer: state.customer.items,
  isCustomerLogged: isCustomerLoggedSelector(state),
  envConfig: state.storeConfig.envConfig,
});

export default connect(mapStateToProps)(PreloadedProductMini);
