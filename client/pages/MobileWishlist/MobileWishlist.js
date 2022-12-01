import pt from 'prop-types';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GridView from '@client/components/Icons/GridView';
import ListView from '@client/components/Icons/ListView';
import Layout from '@client/components/Layout';
import NotifyTooltip from '@client/components/NotifyTooltip';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import { Loader, ProductList, ProductSorting } from '@client/magenta-ui';
import { addItems } from '@client/reducers/cart';
import {
  fetchWishlist,
  fetchWishlistProducts,
  removeFromWishlist,
} from '@client/reducers/wishlist';
import {
  getBaseMediaUrl,
  getCartItemsBySKU,
  getIsWishlistLoading,
  getIsWishlistProductsLoading,
  getWishlistItemsWithProducts,
  isCartLoadedSelector,
} from '@client/selectors';

import './MobileWishlist.scss';

const modes = {
  GRID_VIEW: 0,
  LIST_VIEW: 1,
};

class MobileWishList extends PureComponent {
  static propTypes = {
    translate: pt.func.isRequired,
    baseMediaUrl: pt.string.isRequired,
    cartItemsBySKU: pt.object.isRequired,
  };

  state = {
    productsListMode: modes.GRID_VIEW,
    sortingOpen: false,
    sortingMode:
      queryString.parse(this.props.location.search).sort || 'ranking,desc',
  };

  fetchProducts = ({
    page = 1,
    sort = this.state.sortingMode,
    needReload = false,
  } = {}) => {
    const params = {
      page_size: 10,
      page_number: page,
      sort: sort,
      needReload,
    };

    this.props.fetchWishlistProducts(params);
  };

  componentDidMount() {
    this.props.fetchWishlist();
    this.fetchProducts();
  }

  onSortByChange = (e, data) => {
    const { history, location } = this.props;
    const curentSortValue = data.value;
    const path = location.pathname;
    const search = queryString.parse(location.search);
    const meargSearch = Object.assign({}, search, { sort: curentSortValue });

    history.push({
      pathname: path,
      search: queryString.stringify(meargSearch),
    });

    this.setState({ sortingMode: curentSortValue, sortingOpen: false });

    this.fetchProducts({ needReload: true, sort: curentSortValue });
  };

  renderBuyButton() {
    const { onAddItems, cartItemsBySKU, isCartLoaded, translate } = this.props;

    const products = this.props.products.items.map(product =>
      cartItemsBySKU[product.sku]
        ? {
            ...product,
            isAddedToWishlist: true,
            qty: cartItemsBySKU[product.sku].qty,
          }
        : {
            ...product,
            isAddedToWishlist: true,
            qty: 0,
          },
    );

    return (
      <div className="wl-mobile-buy-buttons">
        <div className="wl-mobile-buy-button__container">
          <button
            className="wl-mobile-buy-button"
            onClick={() => isCartLoaded && onAddItems(products)}
          >
            {translate('wishlist.buy_button')}
          </button>
        </div>
      </div>
    );
  }

  renderSorting() {
    const {
      sorting,
      translate,
      isWishlistLoading,
      isWishlistProductsLoading,
    } = this.props;

    const sortingLabel = {
      label: translate('sorting.label'),
      position: {
        asc: translate('sorting.position.asc'),
        desc: translate('sorting.position.desc'),
      },
      name: {
        asc: translate('sorting.name.asc'),
        desc: translate('sorting.name.desc'),
      },
      price: {
        asc: translate('sorting.price.asc'),
        desc: translate('sorting.price.desc'),
      },
      ranking: {
        asc: translate('sorting.relevance.asc'),
        desc: translate('sorting.relevance.desc'),
      },
    };

    const sortingObj = sorting.filter(el => {
      return el.code === 'name' || el.code === 'price' || el.code === 'ranking';
    });

    return (
      <ProductSorting
        mini
        sorting={sortingObj}
        onClick={() => this.setState({ sortingOpen: !this.state.sortingOpen })}
        onSortByChange={this.onSortByChange}
        value={this.state.sortingMode}
        sortingLabel={sortingLabel}
        loading={isWishlistLoading || isWishlistProductsLoading}
        open={this.state.sortingOpen}
      />
    );
  }

  renderProductListControls() {
    return (
      <div className="wl-mobile-list-controls">
        <div className="wl-mobile-list-controls--column">
          {this.state.productsListMode === modes.GRID_VIEW ? (
            <div
              className="wl-mobile-list-view-control"
              onClick={() =>
                this.setState({ productsListMode: modes.LIST_VIEW })
              }
            >
              <GridView
                className="wl-mobile-list-controls--grid-view"
                active={this.state.productsListMode === modes.GRID_VIEW}
              />
              <div className="wl-mobile-list-controls--grid-view-text">
                Grid View
              </div>
            </div>
          ) : (
            <div
              className="wl-mobile-list-view-control"
              onClick={() =>
                this.setState({ productsListMode: modes.GRID_VIEW })
              }
            >
              <ListView
                className="wl-mobile-list-controls--list-view"
                active={this.state.productsListMode === modes.LIST_VIEW}
              />
              <div className="wl-mobile-list-controls--list-view-text">
                List View
              </div>
            </div>
          )}
        </div>

        <div className="wl-mobile-list-controls--column">
          {this.renderSorting()}
        </div>
      </div>
    );
  }

  renderWishlistProducts() {
    const {
      translate,
      baseMediaUrl,
      cartItemsBySKU,
      totalCount,
      isWishlistProductsLoading,
      isWishlistLoading,
      removeItemFromWishlist,
      loadingCartProduct,
      productBadge,
    } = this.props;
    const products = this.props.wishlistItemsWithProducts.map(({ product }) =>
      cartItemsBySKU[product.sku]
        ? {
            ...product,
            isAddedToWishlist: true,
            qty: cartItemsBySKU[product.sku].qty,
            url: `/${product.url_key}`,
          }
        : {
            ...product,
            isAddedToWishlist: true,
            qty: 0,
            url: `/${product.url_key}`,
          },
    );

    const hasMoreItems = totalCount > products.length;

    return (
      <div style={{ position: 'relative' }}>
        <InfiniteScroll
          element="div"
          pageStart={1}
          hasMore={hasMoreItems && !isWishlistProductsLoading}
          loader={null}
          threshold={50}
          loadMore={page => this.fetchProducts({ page })}
        >
          {this.state.sortingOpen && <div className="wl-mobile-mask" />}
          <ProductList
            type={
              this.state.productsListMode === modes.GRID_VIEW ? 'grid' : 'rows'
            }
            id="product-list"
            products={products}
            baseMediaUrl={`${baseMediaUrl}catalog/product/`}
            addToCartLabel={translate('product.add_to_cart')}
            PromoBadgeNamesComponent={PromoBadgesNames}
            PromoBadgeIconsComponent={PromoBadgesIcons}
            outOfStockLabel={translate('product.out_of_stock')}
            priceLabel={translate('product_list.price_label')}
            saveLabel={translate('product.save')}
            unitLabel={translate('unit.baht')}
            onRemoveFromWishlist={removeItemFromWishlist}
            NotifyTooltipComponent={NotifyTooltip}
            productBadgeConfig={productBadge}
            loadingCartProduct={loadingCartProduct}
          />
          {(isWishlistLoading || isWishlistProductsLoading) && (
            <Loader active inline="centered" />
          )}
        </InfiniteScroll>
      </div>
    );
  }

  render() {
    return (
      <Layout>
        {this.renderProductListControls()}
        {this.renderWishlistProducts()}
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  baseMediaUrl: getBaseMediaUrl(state),
  cartItemsBySKU: getCartItemsBySKU(state),
  products: state.product,
  productBadge: state.product.productBadge.items,
  totalCount: state.product.total_count,
  isWishlistLoading: getIsWishlistLoading(state),
  isWishlistProductsLoading: getIsWishlistProductsLoading(state),
  sorting: state.product.sorting,
  isCartLoaded: isCartLoadedSelector(state),
  wishlistItemsWithProducts: getWishlistItemsWithProducts(state),
  loadingCartProduct: state.cart.loadingProduct,
  envConfig: state.storeConfig.envConfig,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onAddItems: addItems,
      fetchWishlist,
      fetchWishlistProducts,
      removeItemFromWishlist: removeFromWishlist,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MobileWishList);
