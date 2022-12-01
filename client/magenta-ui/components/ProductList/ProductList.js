import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Swiper from 'swiper/dist/js/swiper.js';

import ProductItem from '@client/magenta-ui/components/ProductItem';

const TYPES = {
  SLIDE: 'slider',
  GRID: 'grid',
  MINI: 'mini',
  ROWS: 'rows',
};

class ProductList extends PureComponent {
  initialSwiper(node) {
    const { setting, id, isCustomSlide } = this.props;

    if (this.swiper) {
      return null;
    }

    const defaultSettings = {
      slidesPerView: 'auto',
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      allowTouchMove: false,
      navigation: {
        nextEl: `.swiper-button-next-${id}`,
        prevEl: `.swiper-button-prev-${id}`,
      },
    };

    const customSetting = {};
    const swiperCustomSetting = {
      observer: true,
      observeParents: true,
      on: {
        observerUpdate: () => {
          if (window.innerWidth > 991) {
            const itemWidth = this.swiper.slides.css('width');
            const containerWidth = this.swiper.width;
            const perGroup = Math.floor(containerWidth / parseInt(itemWidth));
            this.swiper.params.slidesPerGroup = perGroup;
          }
        },
        resize: () => {
          if (window.innerWidth > 991) {
            const itemWidth = this.swiper.slides.css('width');
            const containerWidth = this.swiper.width;
            const perGroup = Math.floor(containerWidth / parseInt(itemWidth));
            this.swiper.params.slidesPerGroup = perGroup;
          }
        },
      },
      breakpoints: {
        // when window width is <= 991px
        991: {
          slidesPerGroup: 1,
          allowTouchMove: true,
        },
      },
    };

    if (isCustomSlide) {
      Object.assign(customSetting, swiperCustomSetting);
    }

    const objSetting = Object.assign(
      {},
      defaultSettings,
      setting,
      customSetting,
    );

    this.swiper = new Swiper(node, objSetting);
  }

  render() {
    const {
      products,
      onAddToWishlist,
      className,
      type,
      overflow,
      priceLabel,
      id,
      baseMediaUrl,
      PromoBadgeNamesComponent,
      PromoBadgeIconsComponent,
      PromoLinkComponent,
      NotifyTooltipComponent,
      addToCartLabel,
      outOfStockLabel,
      saveLabel,
      unitLabel,
      onRemoveFromWishlist,
      loadingCartProduct,
      greyOutNotAvailable,
      productBadgeConfig,
      mediaUrl,
      onPreLoader,
      environment,
      trackingSection,
      trackingUserId,
      isCartLoaded,
      section,
      beforeAddProductCallback,
    } = this.props;
    const itemClass = type === TYPES.SLIDE ? 'swiper-slide' : 'mt-product-item';

    const productItems = products.map((product, key) => {
      const productBadgeObj = find(
        product.custom_attributes_option,
        item => item.attribute_code === 'product_badge',
      );

      const attrProductBadge = !isEmpty(productBadgeObj)
        ? productBadgeObj.value
        : '';
      const productBadge = find(
        productBadgeConfig,
        config => config.id === attrProductBadge,
      );

      const consumerUnitObj = find(
        product.custom_attributes_option,
        item => item.attribute_code === 'consumer_unit',
      );
      let consumerUnit = consumerUnitObj ? consumerUnitObj.value : priceLabel;

      const weightItemInd = product?.weight_item_ind;
      const sellingUnit = product?.selling_unit;

      if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
        consumerUnit = sellingUnit;
      }

      const isOutOfStock =
        !get(product, 'extension_attributes.stock_item.is_in_stock', true) ||
        !get(product, 'extension_attributes.stock_item.qty');

      return (
        <ProductItem
          key={product.sku}
          greyOutNotAvailable={greyOutNotAvailable}
          type={type}
          orderItem={key}
          isRowMode={type === TYPES.ROWS}
          product={product}
          className={itemClass}
          title={get(product, 'name', '')}
          img={`${baseMediaUrl}${get(product, 'image', '')}`}
          id={get(product, 'id', '')}
          sku={get(product, 'sku', '')}
          name={get(product, 'name', '')}
          price={get(product, 'price', 0)}
          specialPrice={parseFloat(get(product, 'special_price', 0))}
          priceLabel={consumerUnit}
          isAddedToWishlist={product.isAddedToWishlist}
          onAddToWishlist={onAddToWishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
          promoNamesNode={
            PromoBadgeNamesComponent ? (
              <PromoBadgeNamesComponent product={product} />
            ) : null
          }
          promoIconsNode={
            PromoBadgeIconsComponent ? (
              <PromoBadgeIconsComponent product={product} />
            ) : null
          }
          promoLinkNode={
            PromoLinkComponent ? <PromoLinkComponent product={product} /> : null
          }
          notifyTooltipNode={
            NotifyTooltipComponent ? (
              <NotifyTooltipComponent product={product} />
            ) : null
          }
          url={product?.url || `/${product?.url_key}` || ''}
          disableAddToCart={isOutOfStock}
          raised={false}
          description={get(product, 'description', '')}
          badge={get(product, 'badge', '')}
          addToCartLabel={addToCartLabel}
          outOfStockLabel={outOfStockLabel}
          qty={get(product, 'qty', '')}
          saveLabel={saveLabel}
          unitLabel={unitLabel}
          loadingCartProduct={loadingCartProduct[product.sku]}
          isCartLoaded={isCartLoaded}
          productBadge={productBadge}
          baseMediaUrl={mediaUrl}
          onPreLoader={onPreLoader}
          environment={environment}
          trackingSection={trackingSection}
          trackingUserId={trackingUserId}
          productType={id}
          section={section}
          beforeAddProductCallback={beforeAddProductCallback}
        />
      );
    });

    switch (type) {
      case TYPES.SLIDE:
        return (
          <div
            id={id}
            className={`mt-product-list mt-product-list--slider ${className}`}
          >
            <div
              className="swiper-container"
              ref={node => (node ? this.initialSwiper(node) : null)}
            >
              <div className="swiper-wrapper">{productItems}</div>
              <div className="swiper-scrollbar" />
            </div>
            <div className={`swiper-button-next swiper-button-next-${id}`} />
            <div className={`swiper-button-prev swiper-button-prev-${id}`} />
          </div>
        );
      case TYPES.MINI:
        return (
          <div
            id={id}
            className={`mt-product-list mt-product-list--mini ${className}`}
          >
            {productItems}
          </div>
        );
      case TYPES.ROWS:
        return (
          <div
            id={id}
            className={`mt-product-list mt-product-list--rows ${className}`}
            data-scrollable={overflow}
          >
            {productItems}
          </div>
        );
      default:
        return (
          <div
            id={id}
            className={`mt-product-list mt-product-list--wrap ${className}`}
            data-scrollable={overflow}
          >
            {productItems}
          </div>
        );
    }
  }
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      sku: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
    }),
  ).isRequired,
  onAddToWishlist: PropTypes.func,
  onRemoveFromWishlist: PropTypes.func,
  className: PropTypes.string.isRequired,
  type: PropTypes.string,
  overflow: PropTypes.bool,
  addToCartLabel: PropTypes.string,
  PromoBadgeNamesComponent: PropTypes.any,
  PromoBadgeIconsComponent: PropTypes.any,
  NotifyTooltipComponent: PropTypes.any,
  priceLabel: PropTypes.string,
  outOfStockLabel: PropTypes.string,
  mediaUrl: PropTypes.string,
  trackingSection: PropTypes.string,
  trackingUserId: PropTypes.string,
  section: PropTypes.string,
  beforeAddProductCallback: PropTypes.func,
};

ProductList.defaultProps = {
  type: 'wrap',
  overflow: false,
  PromoBadgeNamesComponent: null,
  PromoBadgeIconsComponent: null,
  NotifyTooltipComponent: null,
  addToCartLabel: 'Add to Cart',
  outOfStockLabel: 'Out of Stock',
  onAddToWishlist: noop,
  onRemoveFromWishlist: noop,
  priceLabel: '',
  mediaUrl: '',
  trackingSection: '',
  trackingUserId: '',
  section: '',
  beforeAddProductCallback: noop,
};

export default ProductList;
