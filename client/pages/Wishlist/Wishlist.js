import { head } from 'lodash';
import pt from 'prop-types';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Breadcrumbs from '@client/components/Breadcrumbs';
import GridView from '@client/components/Icons/GridView';
import ListView from '@client/components/Icons/ListView';
import Layout from '@client/components/Layout';
import MetaTags from '@client/components/MetaTags';
import NotifyTooltip from '@client/components/NotifyTooltip';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import Tabbar from '@client/components/Tabbar';
import {
  Breadcrumb,
  Loader,
  Menu,
  ProductList,
  ProductSorting,
} from '@client/magenta-ui';
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
  getWishlist,
  getWishlistItemsWithProducts,
  isCartLoadedSelector,
} from '@client/selectors';
import { fullpathUrl } from '@client/utils/url';

import './Wishlist.scss';

const modes = {
  GRID_VIEW: 0,
  LIST_VIEW: 1,
};

class WishList extends PureComponent {
  static propTypes = {
    translate: pt.func.isRequired,
    baseMediaUrl: pt.string.isRequired,
    cartItemsBySKU: pt.object.isRequired,
    onAddItems: pt.func.isRequired,
    isCartLoaded: pt.bool.isRequired,
    wishlistItemsWithProducts: pt.array.isRequired,
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

    if (this.props.isWishlistProductsLoading) {
      return;
    }

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

  renderBreadcrumbs() {
    const breadcrumbs = [
      {
        label: this.props.translate('homepage_text'),
        url: '/',
      },
      {
        label: this.props.translate('wishlistpage_text'),
        url: '/wishlist',
        isStatic: true,
      },
    ];

    return (
      <div className="breadcrumb-background">
        <Breadcrumb>
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumbs
              key={breadcrumb.label}
              label={breadcrumb.label}
              url={breadcrumb.url}
              isStatic={breadcrumb.isStatic}
              hasNext={index < breadcrumbs.length - 1}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  renderBanner() {
    return (
      <div className="wl-banner-background">
        <img
          className="wl-banner-image"
          src="/assets/images/wl-banner-image.jpg"
          alt="Wishlist Banner"
        />
        <h1 className="wl-banner-text">
          {this.props.translate('wishlistpage_text')}
        </h1>
      </div>
    );
  }

  renderBuyButton() {
    const {
      onAddItems,
      cartItemsBySKU,
      isCartLoaded,
      wishlistItemsWithProducts,
      translate,
    } = this.props;
    const products = wishlistItemsWithProducts.map(item => item.product);
    const productsWithQty = products.map(product =>
      cartItemsBySKU[product.sku]
        ? { ...product, qty: cartItemsBySKU[product.sku].qty }
        : { ...product, qty: 0 },
    );

    return (
      <div className="wl-buy-button__container">
        <button
          className="wl-buy-button"
          onClick={() => isCartLoaded && onAddItems(productsWithQty)}
        >
          {translate('wishlist.buy_button')}
        </button>
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
      <div className="wl-list-controls">
        <div className="wl-list-view-controls">
          <GridView
            className="wl-list-controls--grid-view"
            active={this.state.productsListMode === modes.GRID_VIEW}
            onClick={() => this.setState({ productsListMode: modes.GRID_VIEW })}
          />
          <ListView
            className="wl-list-controls--list-view"
            active={this.state.productsListMode === modes.LIST_VIEW}
            onClick={() => this.setState({ productsListMode: modes.LIST_VIEW })}
          />
        </div>
        {this.renderSorting()}
      </div>
    );
  }

  renderWishlistProducts() {
    const {
      translate,
      baseMediaUrl,
      cartItemsBySKU,
      isWishlistLoading,
      isWishlistProductsLoading,
      removeItemFromWishlist,
      totalCount,
      loadingCartProduct,
      storeConfig,
      envConfig,
      productBadge,
    } = this.props;

    const products = this.props.wishlistItemsWithProducts.map(
      item => item.product,
    );
    const productsWithQty = products.map(product =>
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
      <InfiniteScroll
        element="div"
        pageStart={1}
        hasMore={hasMoreItems && !isWishlistProductsLoading}
        loader={null}
        threshold={50}
        loadMore={page => this.fetchProducts({ page })}
      >
        <ProductList
          type={
            this.state.productsListMode === modes.GRID_VIEW ? 'grid' : 'rows'
          }
          id="product-list"
          products={productsWithQty}
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
          loadingCartProduct={loadingCartProduct}
          productBadgeConfig={productBadge}
          mediaUrl={storeConfig.base_media_url}
          environment={envConfig.env}
        />
        {(isWishlistLoading || isWishlistProductsLoading) && (
          <Loader active inline="centered" />
        )}
      </InfiniteScroll>
    );
  }

  render() {
    const { translate } = this.props;
    return (
      <Layout
        isWishlist
        customItems={() => (
          <Menu.Item
            key="my-list"
            className="sidebar-item active"
            name={this.props.translate('wishlistpage_text')}
            active
          >
            <a className="sidebar-link" href="javascript: void(0)">
              {this.props.translate('wishlistpage_text')}
            </a>
            <span className="sidebar-icon">
              <i className="nav-icon" />
            </span>
          </Menu.Item>
        )}
      >
        <MetaTags
          canonicalUrl={head(fullpathUrl(this.props.location).split('?'))}
          title={translate('meta_tags.wishlist.title')}
          keywords={translate('meta_tags.wishlist.keywords')}
          description={translate('meta_tags.wishlist.description')}
        />

        <Tabbar />
        {this.renderBreadcrumbs()}
        {this.renderBanner()}
        {this.renderProductListControls()}
        {this.renderWishlistProducts()}
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  products: state.product,
  productBadge: state.product.productBadge.items,
  isWishlistLoading: getIsWishlistLoading(state),
  isWishlistProductsLoading: getIsWishlistProductsLoading(state),
  sorting: state.product.sorting,
  translate: getTranslate(state.locale),
  baseMediaUrl: getBaseMediaUrl(state),
  cartItemsBySKU: getCartItemsBySKU(state),
  isCartLoaded: isCartLoadedSelector(state),
  wishlistItemsWithProducts: getWishlistItemsWithProducts(state),
  wishlist: getWishlist(state),
  totalCount: state.product.total_count,
  storeConfig: state.storeConfig.current,
  loadingCartProduct: state.cart.loadingProduct,
  payment: state.checkout.payment,
  envConfig: state.storeConfig.envConfig,
  cart: state.cart.cart,
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

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
