import filter from 'lodash/filter';
import find from 'lodash/find';
import prop from 'lodash/get';
import map from 'lodash/map';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import NotifyTooltip from '@client/components/NotifyTooltip';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import PromoLink from '@client/components/PromoLink';
import { Loader, ProductList } from '@client/magenta-ui';
import { addtoWishlist, removeFromWishlist } from '@client/reducers/wishlist';
import { getWishlistItmesByProductId } from '@client/selectors';
import Exploder from '@client/utils/mcaex';

class PreloadedProductGrid extends PureComponent {
  static defaultProps = {
    products: [],
    onPreload: noop,
    ownProducts: null,
    section: '',
    beforeAddProductCallback: noop,
  };

  static propTypes = {
    products: PropTypes.array,
    ownProducts: PropTypes.array,
    storeConfig: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    onPreload: PropTypes.func,
    filterFunc: PropTypes.func.isRequired,
    cart: PropTypes.object.isRequired,
    loadingCartProduct: PropTypes.object,
    section: PropTypes.string,
    beforeAddProductCallback: PropTypes.func,
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
      ownProducts,
      translate,
      storeConfig,
      filterFunc,
      cart,
      onLoadmore,
      onPreLoader,
      hasMoreItems,
      loading,
      element,
      loadingCartProduct,
      wishlistItems,
      envConfig,
      trackingSection,
      trackingUserId,
      productBadge,
      section,
      beforeAddProductCallback,
    } = this.props;
    let filteredProducts = filter(ownProducts || products, filterFunc);

    filteredProducts = map(filteredProducts, product => {
      if (product.custom_attributes) {
        const formatItem = Exploder.explode(product);
        formatItem.special_price = prop(product, 'special_price', 0);
        formatItem.special_from_date = prop(product, 'special_from_date', '');
        formatItem.special_to_date = prop(product, 'special_to_date', '');
        formatItem.url = `/${product.url_key}`;
        return formatItem;
      }
      return product;
    });

    filteredProducts = map(filteredProducts, product => ({
      ...product,
      url: product.url || `/${product.url_key}`,
      qty: find(cart.items, item => item.sku === product.sku)?.qty || 0,
      isAddedToWishlist: !!wishlistItems[product.id],
    }));

    const productList = (
      <ProductList
        id="product-list"
        products={filteredProducts}
        PromoBadgeNamesComponent={PromoBadgesNames}
        PromoBadgeIconsComponent={PromoBadgesIcons}
        PromoLinkComponent={PromoLink}
        baseMediaUrl={`${storeConfig.base_media_url}catalog/product`}
        addToCartLabel={translate('product.add_to_cart')}
        outOfStockLabel={translate('product.out_of_stock')}
        priceLabel={translate('product_list.price_label')}
        saveLabel={translate('product.save')}
        unitLabel={translate('unit.baht')}
        loadingCartProduct={loadingCartProduct}
        onAddToWishlist={this.props.onAddToWishlist}
        onRemoveFromWishlist={this.props.onRemoveFromWishlist}
        NotifyTooltipComponent={NotifyTooltip}
        productBadgeConfig={productBadge}
        mediaUrl={storeConfig.base_media_url}
        onPreLoader={onPreLoader}
        environment={envConfig.env}
        trackingSection={trackingSection}
        trackingUserId={trackingUserId}
        section={section}
        beforeAddProductCallback={beforeAddProductCallback}
      />
    );

    return (
      <div className="product-grid">
        {onLoadmore ? (
          <InfiniteScroll
            className="product-grid--infinite"
            ref={node => element(node)}
            element="div"
            pageStart={1}
            hasMore={hasMoreItems}
            loader={null}
            threshold={10}
            loadMore={onLoadmore}
          >
            {productList}
            {loading && <Loader active inline="centered" />}
          </InfiniteScroll>
        ) : (
          <Fragment>
            <div className="product-grid--static">{productList}</div>
            {loading && <Loader active inline="centered" />}
          </Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  loadingCartProduct: state.cart.loadingProduct,
  products: state.product.items,
  productBadge: state.product.productBadge.items,
  storeConfig: state.storeConfig.current,
  translate: getTranslate(state.locale),
  wishlistItems: getWishlistItmesByProductId(state),
  envConfig: state.storeConfig.envConfig,
});

const mapDispatchToProps = dispatch => ({
  onAddToWishlist: pid =>
    dispatch(
      addtoWishlist(
        pid,
        `${window.location.pathname}${window.location.search}`,
      ),
    ),
  onRemoveFromWishlist: pid => dispatch(removeFromWishlist(pid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreloadedProductGrid);
