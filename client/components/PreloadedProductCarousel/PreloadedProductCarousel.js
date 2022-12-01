import filter from 'lodash/filter';
import find from 'lodash/find';
import prop from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import noop from 'lodash/noop';
import uniqBy from 'lodash/uniqBy';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import NotifyTooltip from '@client/components/NotifyTooltip';
import { ProductListPreloader } from '@client/components/PreloaderComponent';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import PromoLink from '@client/components/PromoLink';
import { HeadTitle, ProductList } from '@client/magenta-ui';
import { addtoWishlist, removeFromWishlist } from '@client/reducers/wishlist';
import { getWishlistItmesByProductId } from '@client/selectors';
import { isCartLoadedSelector } from '@client/selectors';
import Exploder from '@client/utils/mcaex';

import './PreloadProductCarousel.scss';

class PreloadedProductCarousel extends PureComponent {
  static defaultProps = {
    loading: false,
    products: [],
    url: '',
    button: false,
    className: '',
    min: 0,
    sortingFunc: null,
    onAddToWishlist: noop,
    onRemoveFromWishlist: noop,
    title: '',
    ownProducts: null,
    wishlistItems: {},
    filterFunc: p => p,
    productSets: [],
    isCustomSlide: false,
    btnName: 'view_all',
    trackingSection: '',
    trackingUserId: '',
    section: '',
    beforeAddProductCallback: noop,
  };

  static propTypes = {
    loading: PropTypes.bool,
    products: PropTypes.array,
    storeConfig: PropTypes.object.isRequired,
    translate: PropTypes.func.isRequired,
    filterFunc: PropTypes.func,
    sortingFunc: PropTypes.func,
    title: PropTypes.string,
    onAddToWishlist: PropTypes.func,
    onRemoveFromWishlist: PropTypes.func,
    cart: PropTypes.object.isRequired,
    url: PropTypes.string,
    button: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    min: PropTypes.number,
    loadingCartProduct: PropTypes.object,
    onNavClick: PropTypes.func,
    wishlistItems: PropTypes.object,
    content: PropTypes.node,
    ownProducts: PropTypes.array,
    productSets: PropTypes.array,
    trackingSection: PropTypes.string,
    trackingUserId: PropTypes.string,
    section: PropTypes.string,
    isCustomSlide: PropTypes.bool,
    btnName: PropTypes.string,
    beforeAddProductCallback: PropTypes.func,
  };

  render() {
    const {
      id,
      products,
      translate,
      storeConfig,
      filterFunc,
      sortingFunc,
      min,
      title,
      cart,
      button,
      loading,
      url,
      className,
      loadingCartProduct,
      ownProducts,
      content,
      wishlistItems,
      productSets,
      isCustomSlide,
      titlePosition,
      titleLine,
      btnName,
      envConfig,
      trackingSection,
      trackingUserId,
      isCartLoaded,
      productBadge,
      section,
      beforeAddProductCallback,
    } = this.props;

    let filteredProducts = [];
    if (!isEmpty(productSets)) {
      filteredProducts = filter(productSets, filterFunc);
    } else {
      filteredProducts = filter(ownProducts || products, filterFunc);
    }

    if (sortingFunc) filteredProducts.sort(sortingFunc);

    filteredProducts = map(filteredProducts, product => ({
      ...product,
      qty: find(cart.items, item => item.sku === product.sku)?.qty || 0,
      isAddedToWishlist: !!wishlistItems[product.id],
    }));

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

    filteredProducts = uniqBy(filteredProducts, 'id');
    const itemCount = filteredProducts ? filteredProducts.length : 0;

    return (
      <div className="product-carousel">
        {filteredProducts.length > min && (
          <div
            className="product-carousel-container"
            data-item-count={itemCount}
          >
            {title && (
              <HeadTitle
                className="head-title"
                topic={title}
                url={url}
                button={button}
                btnName={this.props.translate(btnName)}
                onNavClick={this.props.onNavClick}
                position={titlePosition}
                line={titleLine}
              />
            )}
            {loading && <ProductListPreloader />}
            {!loading &&
              (content || (
                <ProductList
                  id={id}
                  className={className}
                  type="slider"
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
                  isCartLoaded={isCartLoaded}
                  onAddToWishlist={this.props.onAddToWishlist}
                  onRemoveFromWishlist={this.props.onRemoveFromWishlist}
                  NotifyTooltipComponent={NotifyTooltip}
                  productBadgeConfig={productBadge}
                  mediaUrl={storeConfig.base_media_url}
                  isCustomSlide={isCustomSlide}
                  environment={envConfig.env}
                  trackingSection={trackingSection}
                  trackingUserId={trackingUserId}
                  section={section}
                  beforeAddProductCallback={beforeAddProductCallback}
                />
              ))}
          </div>
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
  isCartLoaded: isCartLoadedSelector(state),
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
)(PreloadedProductCarousel);
