import Cookie from 'js-cookie';
import {
  difference,
  every,
  filter,
  find,
  get as prop,
  head,
  isEmpty,
  isUndefined,
  map,
  omit,
} from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { Component } from 'react';
import { isMobile } from 'react-device-detect';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import Breadcrumbs from '@client/components/Breadcrumbs';
import SearchIcon from '@client/components/Icons/SearchIcon';
import Layout from '@client/components/Layout';
import MetaTags from '@client/components/MetaTags';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import PreloadedProductGrid from '@client/components/PreloadedProductGrid';
import Tabbar from '@client/components/Tabbar';
import { ProductImpression } from '@client/features/gtm/models/Product';
import withCategories from '@client/hoc/withCategories';
import withFirebaseContext from '@client/hoc/withFirebaseContext';
import {
  Breadcrumb,
  Button,
  Icon,
  ProductFilter,
  ProductSorting,
  Pusher,
} from '@client/magenta-ui';
import { checkDefaultShipping } from '@client/reducers/cart';
import {
  fetchNewProduct,
  fetchProductByCategorySet,
  formatFilter,
  resetFilter,
  setActiveFilter,
  setActiveSorting,
} from '@client/reducers/product';
import { clearProductProp, searchProducts } from '@client/reducers/search';
import { getCustomerSelector } from '@client/selectors';
import { getActiveCategoryList } from '@client/utils/category';
import { eventTracking } from '@client/utils/datalakeTracking';
import { googleOptimize } from '@client/utils/googleOptimize';
import Exploder from '@client/utils/mcaex';
import { fullpathUrl } from '@client/utils/url';

import './Search.scss';

const DEFAULT_SORT = 'relevance,desc';

@withCategories
@withFirebaseContext
class Search extends Component {
  static propTypes = {
    searchProducts: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
  };

  state = {
    categoryId: queryString.parse(this.props.location.search).category_id,
    sort: queryString.parse(this.props.location.search).sort || DEFAULT_SORT,
    sortingOpen: false,
    filterOpen: false,
    hasMoreItems: false,
    searchValues: [],
    showAll: false,
    settingsMode: 'none',
    pageGTM: 0,
    firstFeatSearch: false,
    featLoading: false,
  };

  componentDidMount() {
    const { location } = this.props;

    if (this.props?.categories?.length <= 0) {
      this.props.fetchCategory();
    }

    if (location.pathname.includes('/search')) {
      // this.initialSearch();
      this.setState({
        firstFeatSearch: true,
        featLoading: true,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.firstFeatSearch) {
      this.initialSearch();
      this.setState({
        firstFeatSearch: false,
      });
    }

    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.search !== this.props.location.search
    ) {
      if (this.props.location.pathname.includes('/search')) {
        this.initialSearch();
        this.setState({ pageGTM: 0 });
      }
    }

    const prevProduct = prevProps.products;
    const { products } = this.props;
    if (prevProduct && products && products.length !== prevProduct.length) {
      const currentProd = Object.values(this.props.products).map(
        (item, index) => {
          item['order'] = index;
          return item;
        },
      );

      const prevProd = Object.values(prevProps.products).map((item, index) => {
        item['order'] = index;
        return item;
      });
      const diffProducts = difference(currentProd, prevProd);
      if (diffProducts.length > 0) {
        this.impressionEventProduct(diffProducts, this.state.pageGTM + 1);
        this.setState({ pageGTM: this.state.pageGTM + 1 });
        this.dsEventTracker(diffProducts);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { productsByQuery } = nextProps;
    if (!this.state.activeSearchQuery || isEmpty(productsByQuery)) {
      return null;
    }

    const currentPage = prop(
      productsByQuery[this.state.activeSearchQuery],
      'search_criteria.current_page',
    );
    const pageSize = prop(
      productsByQuery[this.state.activeSearchQuery],
      'search_criteria.page_size',
    );
    const productsTotal = prop(
      productsByQuery[this.state.activeSearchQuery],
      'total_count',
    );

    const fetchProductOver =
      nextProps.productsLoading === false &&
      currentPage * pageSize > productsTotal;
    const fetchFailed = nextProps.productsFailed;

    if (fetchProductOver || fetchFailed) {
      this.setState({ hasMoreItems: false });
    }
  }

  impressionEventProduct(diffProducts) {
    if (!isUndefined(this.state.activeSearchQuery)) {
      dataLayer.push(
        ProductImpression(
          diffProducts,
          `Search Results/${this.state.activeSearchQuery}`,
        ),
      );
    }
  }

  dsEventTracker(diffProducts) {
    const { customer } = this.props;
    const { url } = this.props.match;
    const userId = prop(customer, 'id', '0').toString();
    if (!isEmpty(diffProducts) && diffProducts.length > 0) {
      Object.keys(diffProducts).map(index => {
        const { sku, price } = diffProducts[index];
        return eventTracking(
          'impression',
          userId,
          sku,
          index,
          url,
          price,
          'search',
        );
      });
    }
  }

  initialABTest = async () => {
    const dataCookieGAEXP = Cookie.get('_gaexp');
    const remoteConfigGoogleOptimize = await this.props?.firestoreAction?.getRemoteConfig(
      'google_optimize',
    );

    let isGoogleOptimize = '';
    if (!isEmpty(remoteConfigGoogleOptimize)) {
      const expIdRecommended =
        JSON.parse(remoteConfigGoogleOptimize)?.exp_id?.search || '';

      isGoogleOptimize = googleOptimize(dataCookieGAEXP, expIdRecommended);
    }

    return isGoogleOptimize;
  };

  async initialSearch() {
    const { location } = this.props;
    const { sort } = this.state;
    const pathnameArray = location.pathname.split('/');
    const multiSearch = pathnameArray[2];
    const singleSearch = pathnameArray[3];
    const searchValues = multiSearch
      .split(',')
      .filter(q => !!q)
      .map(decodeURIComponent);

    this.setState({ hasMoreItems: true });
    if (this.productLoader) this.productLoader.pageLoaded = 1;

    let activeSearchQuery;
    let isSingleSearch;

    if (searchValues.length === 1) {
      isSingleSearch = true;
      activeSearchQuery = searchValues[0];
    } else if (singleSearch) {
      isSingleSearch = true;
      activeSearchQuery = singleSearch;
    }

    const parsedSearchQuery = queryString.parse(this.props.location.search);
    const cateId = parsedSearchQuery.category_id;
    this.searchFilters = omit(parsedSearchQuery, [
      'category_id',
      'sort',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'gclid',
      'gclsrc',
      'affiliate_id',
      'offer_id',
      'fbclid',
      'sc_src',
      'sc_lid',
      'sc_uid',
      'sc_llid',
      'sc_customer',
      'sc_eh',
    ]);

    if (cateId) {
      this.setState({
        categoryId: cateId,
      });
    } else {
      this.setState({
        categoryId: null,
      });
    }

    const abtest = await this.initialABTest();

    if (isSingleSearch) {
      this.props.clearProductProp(activeSearchQuery);
      this.props.searchProducts(
        activeSearchQuery,
        sort,
        cateId,
        1,
        this.searchFilters,
        abtest,
      );
    } else {
      searchValues.forEach(query => {
        this.props.clearProductProp(query);
        this.props.searchProducts(
          query,
          sort,
          cateId,
          1,
          this.searchFilters,
          abtest,
        );
      });
    }

    this.setState({ searchValues, activeSearchQuery, featLoading: false });
    window.scrollTo(0, 0);
  }

  renderBreadcrums() {
    const { translate } = this.props;
    const { searchValues, activeSearchQuery, categoryId } = this.state;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
    ];

    if (searchValues.length > 1) {
      breadcrumbs.push({
        label: translate('search.multiple_search_results'),
        url: `/search/${searchValues}`,
        isStatic: !activeSearchQuery,
        onClick: this.setMultipleSearchResults,
      });
    }

    if (activeSearchQuery) {
      breadcrumbs.push({
        label: `${translate(
          'search.search_results_for',
        )} "${activeSearchQuery}"`,
        url: `/search/${searchValues}/${activeSearchQuery}`,
        isStatic: !categoryId,
      });
    }

    if (categoryId) {
      breadcrumbs.push({
        label: prop(
          find(this.props.categories, cate => cate.id === Number(categoryId)),
          'name',
        ),
        url: `/search/${activeSearchQuery}?category_id=${categoryId}`,
        isStatic: true,
      });
    }

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
              onClick={breadcrumb.onClick}
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  renderSorting() {
    const { sorting, translate, productsLoading } = this.props;
    const { activeSearchQuery, categoryId, settingsMode } = this.state;

    if (
      (!activeSearchQuery && !categoryId) ||
      (isMobile && settingsMode !== 'sorting')
    ) {
      return null;
    }

    const sortingLabel = {
      label: translate('sorting.label'),
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
        value={this.state.sort}
        sortingLabel={sortingLabel}
        loading={productsLoading}
        open={this.state.sortingOpen}
      />
    );
  }

  onSortByChange = (e, data) => {
    this.setState({ sort: data.value, sortingOpen: false });

    let href = `/search/${this.state.searchValues}?sort=${data.value}`;

    if (this.state.categoryId) {
      href += `&category_id=${this.state.categoryId}`;
    }

    if (!isEmpty(this.searchFilters)) {
      href += `&${queryString.stringify(this.searchFilters)}`;
    }

    this.props.history.push(href);
  };

  setMultipleSearchResults = () => {
    this.setState({ activeSearchQuery: null });
  };

  renderFilter(type) {
    const {
      storeConfig,
      productsLoading,
      translate,
      storeConfigDefault,
      setActiveFilter,
      resetFilter,
      filters,
      categories,
      productsByQuery,
    } = this.props;

    if (isMobile && this.state.settingsMode !== 'filters') {
      return null;
    }

    if (isEmpty(categories)) {
      return null;
    }

    if (!this.state.activeSearchQuery || isEmpty(productsByQuery)) {
      return null;
    }

    const queryFilter = prop(
      productsByQuery[this.state.activeSearchQuery],
      'filters',
    );

    if (isEmpty(queryFilter)) {
      return null;
    }

    let allowKey = ['brand_name'];
    const ignoreKey = ['cat'];
    let fixCategory = true;

    if (this.state.categoryId) {
      allowKey = '*';
      fixCategory = false;
    }

    const filterAbleCate = filter(
      getActiveCategoryList(categories),
      cate => cate.level === 2,
    );
    const filterCtegory = find(filters, item => item.attribute_code === 'cat');
    let formatSubCate = filterAbleCate;

    if (filterCtegory) {
      formatSubCate = map(filterAbleCate, subCate => {
        const currentCateFilter = find(
          filterCtegory.items,
          filterCate => filterCate.value == subCate.id,
        );
        if (currentCateFilter) {
          subCate.product_count = currentCateFilter.item_count;
        } else {
          subCate.product_count = 0;
        }
        return subCate;
      });
    }

    const formatedFilter = this.props.formatFilter(queryFilter);

    return (
      <ProductFilter
        ref={node => (this.filters = node)}
        filters={formatedFilter}
        badgeConfig={storeConfigDefault.extension_attributes}
        badgeBaseUrl={storeConfig.base_media_url}
        allowKey={allowKey}
        ignoreKey={ignoreKey}
        onFilterChange={(e, data) => setActiveFilter(data)}
        onFilterReset={resetFilter}
        disabled={productsLoading}
        type={type || 'tab'}
        nodataMessage={translate('filter.empty')}
        labelResetButton={translate('filter.reset')}
        fixCategory={fixCategory}
        categories={formatSubCate}
        labelCategory={translate('filter.category')}
        searchQuery={this.state.activeSearchQuery}
        hideEmptyCategory
      />
    );
  }

  rendeXsFilter() {
    const { translate } = this.props;

    return (
      <div
        className="mobile-top-filter-bar search-top-filter-bar"
        style={{ border: 0, margin: 0 }}
      >
        <div className="mobile-sorting-box">{this.renderSorting()}</div>
        <div className="mobile-filter-box">
          <Pusher
            className="mobile-pusher-filter"
            open={this.state.filterOpen}
            width={300}
            onBackdropClicked={this.closePusher}
            pusherHeader={
              <div className="pusher-header pusher-header--filters">
                <span>
                  <img src="/assets/icons/mobile-filter.png" alt="filter" />
                </span>
                <span>{translate('filter.label')}</span>
              </div>
            }
            pusherFooter={
              <div className="pusher-footer pusher-footer--filters">
                <span>
                  <Button color="brown" onClick={this.props.resetFilter}>
                    {translate('filter.reset')}
                  </Button>
                </span>
                <span>
                  <Button color="green" onClick={this.closePusher}>
                    {translate('filter.done')}
                  </Button>
                </span>
              </div>
            }
          >
            {this.renderFilter('pusher')}
          </Pusher>
        </div>
      </div>
    );
  }

  closePusher = () => {
    this.setState({
      filterOpen: false,
    });
  };

  handleSetQueryActive = query => {
    const { history, location } = this.props;
    history.push({
      pathname: `${location.pathname}/${query}`,
    });
  };

  handleRemoveSearchValue = value => {
    const searchValues = filter(this.state.searchValues, v => v !== value);

    if (isEmpty(searchValues)) {
      this.props.history.push('/');
    } else {
      this.props.history.push(`/search/${searchValues}`);
    }

    this.setState({ searchValues });
  };

  handleShowAllTags = () => {
    this.setState({ showAll: true });
  };

  handleFiltersClick = () => {
    if (this.state.settingsMode === 'filters') {
      this.setState({ settingsMode: 'none' });
    } else {
      this.setState({ settingsMode: 'filters' });
    }
  };

  handleSortingClick = () => {
    if (this.state.settingsMode === 'sorting') {
      this.setState({ settingsMode: 'none' });
    } else {
      this.setState({ settingsMode: 'sorting' });
    }
  };

  beforeAddProductCallback = (product, position) => {
    const { customer } = this.props;
    const { url } = this.props.match;
    const userId = prop(customer, 'id', '0').toString();
    eventTracking(
      'add_to_cart',
      userId,
      product.sku,
      position,
      url,
      product.price,
      'search',
    );
  };

  renderEmptyResults = (query = this.state.activeSearchQuery) => {
    const { translate } = this.props;

    return (
      <div className="search-page-empty-results">
        <SearchIcon width={58} height={58} />
        <div className="header">
          {translate('search.sorry_no_results_matched')} "{query}"
        </div>
        <div>{translate('search.please_check_is_correct')}</div>
        <div className="insider-sr-no-search"></div>
      </div>
    );
  };

  renderProductList() {
    const {
      translate,
      productsByQuery,
      productsLoading,
      customer,
    } = this.props;
    const { searchValues, activeSearchQuery } = this.state;
    const userId = prop(customer, 'id', '0').toString();
    if (
      !productsLoading &&
      !activeSearchQuery &&
      !isEmpty(searchValues) &&
      productsByQuery &&
      every(searchValues, value => !!productsByQuery[value])
    ) {
      return searchValues.map((query, idx) => {
        const products = productsByQuery[query];
        const explodedProducts = map(products.items, item => {
          const formatItem = Exploder.explode(item);
          formatItem.special_price = prop(item, 'special_price', 0);
          formatItem.special_from_date = prop(item, 'special_from_date', '');
          formatItem.special_to_date = prop(item, 'special_to_date', '');
          formatItem.url = `/${item.url_key}`;

          return formatItem;
        });

        return (
          <PreloadedProductCarousel
            key={query}
            id={idx}
            title={`${products.total_count || 0} ${translate(
              'search.count_search_results_for',
            )} "${query}"`}
            button={!!products.total_count}
            min={-1}
            ownProducts={explodedProducts}
            onNavClick={this.handleSetQueryActive.bind(this, query)}
            content={
              isEmpty(products.items) ? this.renderEmptyResults(query) : null
            }
            section={`Search Results/${query}`}
          />
        );
      });
    }

    const products = productsByQuery[activeSearchQuery];

    if (
      !this.state?.featLoading &&
      !productsLoading &&
      isEmpty(prop(products, 'items'))
    ) {
      return this.renderEmptyResults();
    }

    const explodedProducts = products
      ? map(products.items, item => {
          const formatItem = Exploder.explode(item);
          formatItem.special_price = prop(item, 'special_price', 0);
          formatItem.special_from_date = prop(item, 'special_from_date', '');
          formatItem.special_to_date = prop(item, 'special_to_date', '');
          formatItem.url = `/${item.url_key}`;
          return formatItem;
        })
      : [];

    return (
      <PreloadedProductGrid
        ownProducts={explodedProducts}
        element={ref => (this.productLoader = ref)}
        hasMoreItems={this.state.hasMoreItems && !this.props.productsLoading}
        loading={this.props.productsLoading}
        onLoadmore={this.loadmore}
        loadMore
        trackingSection="search"
        trackingUserId={userId}
        section={`Search Results/${activeSearchQuery}`}
        beforeAddProductCallback={this.beforeAddProductCallback}
      />
    );
  }

  loadmore = async page => {
    const cateId = this.state.categoryId;
    const { activeSearchQuery, sort } = this.state;

    const abtest = await this.initialABTest();

    this.props.searchProducts(
      activeSearchQuery,
      sort,
      cateId,
      page,
      this.searchFilters,
      abtest,
    );
  };

  renderMobileSearchValues = () => {
    const { searchValues, showAll } = this.state;

    return (
      <div className="mobile-search-multisearch-values mobile-search-overview-multisearch-values">
        {map(searchValues.slice(0, 2), value => (
          <div key={value} className="multisearch-value">
            <span className="text">{value}</span>
            <Icon
              className="remove"
              onClick={this.handleRemoveSearchValue.bind(this, value)}
            />
          </div>
        ))}
        {searchValues.length > 2 &&
          (showAll ? (
            map(searchValues.slice(2), value => (
              <div key={value} className="multisearch-value">
                <span className="text">{value}</span>
                <Icon
                  className="remove"
                  onClick={this.handleRemoveSearchValue.bind(this, value)}
                />
              </div>
            ))
          ) : (
            <div className="all" onClick={this.handleShowAllTags}>
              {this.props.translate('search.all')} ({searchValues.length})
            </div>
          ))}
      </div>
    );
  };

  renderTitle() {
    if (isMobile && !isEmpty(this.state.searchValues)) {
      return this.renderMobileSearchValues();
    }

    return this.props.translate('search.placeholder');
  }

  renderFilterSortingBar() {
    const { translate } = this.props;

    return (
      <div className="mobile-search-filter-sorting-panel">
        <div
          className="filters"
          onClick={() =>
            this.setState({
              filterOpen: !this.state.filterOpen,
              settingsMode: 'filters',
            })
          }
        >
          <img src="/assets/icons/filter-bar-icon.svg" />
          <span className="text">{translate('search.filters')}</span>
        </div>
        <div
          className="sorting"
          onClick={() =>
            this.setState({
              sortingOpen: !this.state.sortingOpen,
              settingsMode: 'sorting',
            })
          }
        >
          <img src="/assets/icons/sorting-bar-icon.svg" />
          <span className="text">{translate('search.sorting')}</span>
        </div>
      </div>
    );
  }

  render() {
    const { products, translate } = this.props;

    return (
      <div>
        <div id="category-page" className="category-page">
          <MetaTags
            canonicalUrl={head(fullpathUrl(this.props.location).split('?'))}
            title={translate('meta_tags.search.title')}
            keywords={translate('meta_tags.search.keywords')}
            description={translate('meta_tags.search.description')}
          />
          <Layout className="category-page" title={this.renderTitle()}>
            <Tabbar />
            {this.rendeXsFilter()}
            {this.renderBreadcrums()}
            {this.renderFilterSortingBar()}
            {this.state.activeSearchQuery && (
              <div id="filter-bar">{this.renderFilter()}</div>
            )}
            {this.state.activeSearchQuery && !isEmpty(products) && (
              <div id="sorting-bar">{this.renderSorting()}</div>
            )}
            <div className="search-page-product-list">
              {this.renderProductList()}
            </div>
          </Layout>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  products: state.product.items,
  filters: state.product.filters,
  categories: state.category.items,
  productsByQuery: state.search.productsByQuery,
  sorting: state.product.sorting,
  productsLoading: state.search.loading,
  productsTotal: state.product.total_count,
  productsFailed: state.product.failed,
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  productSearch: state.product.search_criteria,
  payment: state.checkout.payment,
  cart: state.cart.cart,
  customer: getCustomerSelector(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchNewProduct: search => dispatch(fetchNewProduct(search)),
  fetchProductByCategorySet: cateSet =>
    dispatch(fetchProductByCategorySet(cateSet)),
  fetchNewProducts: search => dispatch(fetchNewProduct(search)),
  setActiveSorting: data => dispatch(setActiveSorting(data, ownProps)),
  setActiveFilter: data => dispatch(setActiveFilter(data, ownProps)),
  resetFilter: () => dispatch(resetFilter(ownProps)),
  searchProducts: (query, sort, categoryId, page, filters, abtest) =>
    dispatch(searchProducts(query, sort, categoryId, page, filters, abtest)),
  clearProductProp: query => dispatch(clearProductProp(query)),
  formatFilter: filters => dispatch(formatFilter(filters)),
  checkDefaultShipping: product => dispatch(checkDefaultShipping(product)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
