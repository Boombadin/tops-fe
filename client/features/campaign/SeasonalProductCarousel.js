import { breakpoint } from '@central-tech/core-ui';
import find from 'lodash/find';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import ProductApi from '@client/apis/product';
import NotifyTooltip from '@client/components/NotifyTooltip';
import { ProductListPreloader } from '@client/components/PreloaderComponent';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import PromoLink from '@client/components/PromoLink';
import { useFirebaseContext } from '@client/contexts';
import SeasonalHeader from '@client/features/campaign/components/SeasonalHeader';
import withLocales from '@client/hoc/withLocales';
import { ProductList } from '@client/magenta-ui';
import { addtoWishlist, removeFromWishlist } from '@client/reducers/wishlist';
import {
  getWishlistItmesByProductId,
  isCartLoadedSelector,
} from '@client/selectors';
import Exploder from '@client/utils/mcaex';
import { orderProductBySkus } from '@client/utils/product';

const Container = styled.div`
  position: relative;
  margin-bottom: 18px;

  ${breakpoint('xs', 'md')`
    height: 560px;
    margin-left: 15px;
    margin-right: 15px;
  `}
`;
const ContentBorder = styled.div`
  position: absolute;
  width: 100%;
  height: 468px;

  ${({ borderColor }) =>
    `
      border-bottom: 3px solid ${borderColor};
      border-left: 3px solid ${borderColor};
      border-right: 3px solid ${borderColor};
    `}

  ${breakpoint('xs', 'md')`
    height: 466px;

    ${({ borderColor }) =>
      `
        border-bottom: 1px solid ${borderColor};
        border-left: 1px solid ${borderColor};
        border-right: 1px solid ${borderColor};
      `}
  `}
`;
const ProductListContainer = styled(ProductList)`
  height: 465px;
  width: 100%;
  border-top: unset;
  border-left: unset;
  margin-bottom: 0px;
  padding-left: 3px;
  padding-right: 3px;

  .swiper-wrapper {
    height: 465px;
  }
  .swiper-scrollbar {
    display: none;
  }
  .swiper-button-next {
    right: -27px;
  }
  .swiper-button-prev {
    left: -27px;
  }

  ${breakpoint('xs', 'md')`
    height: 526px;
    padding-left: 1px;
    padding-right: 1px;

    .swiper-wrapper {
      height: 465px;
    }
    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
    .swiper-scrollbar {
      display: block;
      position: relative;
      margin-top: 56px;
      left: 0;
      right: 0;
      width: 100%;
    }
  `}
`;
const Remark = styled.div`
  margin-top: 11px;

  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: ${({ fontColor }) => fontColor || '#000000'};

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${breakpoint('xs', 'md')`
    position: absolute;
    bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: unset;

    font-size: 10px;
  `}
`;

export function SeasonalProductCarousel({
  cart,
  envConfig,
  isCartLoaded,
  lang,
  loadingCartProduct,
  onAddToWishlist,
  onRemoveFromWishlist,
  productBadge,
  storeConfig,
  translate,
  wishlistItems,
}) {
  const { firestoreAction } = useFirebaseContext();
  const [products, setProducts] = useState([]);
  const [transformedProducts, setTransformedProducts] = useState([]);
  const [isProductsLoading, setProductsLoading] = useState(false);
  const [seasonalConfig, setSeasonalConfig] = useState({});

  useEffect(() => {
    (async () => {
      setProductsLoading(true);

      const seasonalConfigResponse = await firestoreAction.getSeasonalConfig();
      setSeasonalConfig(seasonalConfigResponse);

      const productResponse = await ProductApi.getCatalogServiceBySku({
        skus: seasonalConfigResponse.sku,
        plpFilter: true,
      });
      const orderedProducts = orderProductBySkus({
        products: productResponse?.items,
        skus: seasonalConfigResponse.sku,
      });
      // TODO remove filter OOS product if catalog-service filter it out correctly
      const inStockProducts = orderedProducts?.filter(
        product =>
          product.extension_attributes?.stock_item?.is_in_stock &&
          product.extension_attributes?.stock_item?.qty > 0,
      );
      const first30Products = inStockProducts?.slice(0, 30);

      setProducts(first30Products);
      setProductsLoading(false);
    })();
  }, [firestoreAction.getSeasonalConfig]);

  useEffect(() => {
    setTransformedProducts(
      products?.map(product => {
        const transformedProduct = product.custom_attributes
          ? Exploder.explode(product)
          : product;

        transformedProduct.qty =
          find(cart.items, item => item.sku === product.sku)?.qty || 0;
        transformedProduct.isAddedToWishlist = !!wishlistItems[product.id];
        transformedProduct.special_price = product.special_price || 0;
        transformedProduct.special_from_date = product.special_from_date || '';
        transformedProduct.special_to_date = product.special_to_date || '';

        return transformedProduct;
      }),
    );
  }, [cart.items, products, wishlistItems]);

  return useMemo(
    () =>
      transformedProducts?.length > 0 && (
        <Container data-testid="seasonal-product-carousel-container">
          <SeasonalHeader lang={lang} seasonalConfig={seasonalConfig} />
          {isProductsLoading ? (
            <ProductListPreloader />
          ) : (
            <React.Fragment>
              <ContentBorder
                data-testid="seasonal-product-carousel-content-border"
                borderColor={seasonalConfig.style?.web?.border_color}
              />
              <ProductListContainer
                isCustomSlide
                addToCartLabel={translate('product.add_to_cart')}
                baseMediaUrl={`${storeConfig.base_media_url}catalog/product`}
                environment={envConfig.env}
                isCartLoaded={isCartLoaded}
                loadingCartProduct={loadingCartProduct}
                mediaUrl={storeConfig.base_media_url}
                outOfStockLabel={translate('product.out_of_stock')}
                priceLabel={translate('product_list.price_label')}
                products={transformedProducts}
                productBadgeConfig={productBadge}
                saveLabel={translate('product.save')}
                unitLabel={translate('unit.baht')}
                type="slider"
                NotifyTooltipComponent={NotifyTooltip}
                PromoBadgeNamesComponent={PromoBadgesNames}
                PromoBadgeIconsComponent={PromoBadgesIcons}
                PromoLinkComponent={PromoLink}
                onAddToWishlist={onAddToWishlist}
                onRemoveFromWishlist={onRemoveFromWishlist}
              />
            </React.Fragment>
          )}
          <Remark
            data-testid="seasonal-product-carousel-remark"
            fontColor={seasonalConfig.style?.web?.homepage_remark_font_color}
          >
            {seasonalConfig.remark?.[lang.url]?.homepage}
          </Remark>
        </Container>
      ),
    [
      envConfig,
      isCartLoaded,
      isProductsLoading,
      lang,
      loadingCartProduct,
      transformedProducts,
      productBadge,
      seasonalConfig,
      storeConfig,
      translate,
    ],
  );
}

SeasonalProductCarousel.propTypes = {
  cart: PropTypes.object,
  loadingCartProduct: PropTypes.string,
  productBadge: PropTypes.array,
  wishlistItems: PropTypes.object,

  envConfig: PropTypes.object.isRequired,
  isCartLoaded: PropTypes.bool.isRequired,
  lang: PropTypes.object.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
  onRemoveFromWishlist: PropTypes.func.isRequired,
  storeConfig: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
};

SeasonalProductCarousel.defaultProps = {
  cart: {},
  loadingCartProduct: '',
  productBadge: [],
  wishlistItems: {},
};

function mapStateToProps(state) {
  return {
    cart: state.cart.cart,
    envConfig: state.storeConfig.envConfig,
    isCartLoaded: isCartLoadedSelector(state),
    loadingCartProduct: state.cart.loadingProduct,
    productBadge: state.product.productBadge.items,
    storeConfig: state.storeConfig.current,
    translate: getTranslate(state.locale),
    wishlistItems: getWishlistItmesByProductId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAddToWishlist: pid =>
      dispatch(
        addtoWishlist(
          pid,
          `${window.location.pathname}${window.location.search}`,
        ),
      ),
    onRemoveFromWishlist: pid => dispatch(removeFromWishlist(pid)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLocales(SeasonalProductCarousel));
