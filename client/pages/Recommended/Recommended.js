import {
  ceil,
  difference,
  filter,
  find,
  get as prop,
  head,
  isEmpty,
  map,
  omit,
  size,
} from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import PreloadedProductGrid from '../../components/PreloadedProductGrid';
import { ProductListPreloader } from '../../components/PreloaderComponent';
import PreloadHeroBannerV2 from '../../components/PreloadHeroBannerV2';
import SpSubCate from '../../components/SpSubCate';
import Tabbar from '../../components/Tabbar';
import { withBannerByName } from '../../features/banner';
import { ProductImpression } from '../../features/gtm/models/Product';
import withCategories from '../../hoc/withCategories';
import {
  Breadcrumb,
  Button,
  Loader,
  ProductFilter,
  ProductSorting,
  Pusher,
} from '../../magenta-ui';
import {
  clearProductProp,
  fetchNewProduct,
  fetchProduct,
  fetchProductRecommendPersonal,
  formatFilter,
  resetFilter,
  setActiveFilter,
  setActiveSorting,
} from '../../reducers/product';
import { isCustomerLoggedSelector } from '../../selectors';
import { getActiveCategoryList } from '../../utils/category';
import { eventTracking } from '../../utils/datalakeTracking';
import { fullpathUrl } from '../../utils/url';

@withCategories
class Recommended extends PureComponent {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
  };

  state = {
    sort: queryString.parse(this.props.location.search).sort || 'ranking,desc',
    sortingOpen: false,
    filterOpen: false,
    hasMoreItems: true,
    currentPage: 0,
    pageItems: 1,
    personalProduct: false,
    pageGTM: 0,
    prevPage: 0,
  };

  componentDidMount() {
    const { pathname } = this.props.location;

    if (size(this.props.categories) <= 0) {
      this.props.fetchCategory();
    }

    const slug = pathname.replace('/recommended', '');
    window.scrollTo(0, 0);
    this.props.clearProductProp();
    if (slug && slug.length) {
      this.fetchProduct(1, true, slug);
    } else {
      this.fetchProduct(1, true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { productsTotal, productSearch } = this.props;
    const { current_page } = productSearch;
    const { currentPage, pageItems } = this.state;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');
    const { isCustomerLogged, customer } = this.props;
    const customerId = prop(customer, 'id', false);

    if (prevProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);

      this.setState({ sort: 'name,asc', hasMoreItems: true });
      this.props.clearProductProp();

      if (slug && slug.length) {
        this.fetchProduct(1, true, slug);
      } else {
        this.fetchProduct(1, true);
      }
    } else if (prevProps.location.search !== this.props.location.search) {
      this.setState({ hasMoreItems: true });
      if (slug && slug.length) {
        this.fetchProduct(1, true, slug);
      } else {
        this.fetchProduct(1, true);
      }
    }

    if (prevProps.location.pathname !== this.props.location.pathname) {
      if (this.filters) this.filters.resetIndex();
      window.scrollTo(0, 0);

      this.setState({ sort: 'name,asc', hasMoreItems: true });
      this.props.clearProductProp();
      if (slug && slug.length) {
        this.fetchProduct(1, true, slug);
      } else {
        this.fetchProduct(1, true);
      }
    }

    if (current_page && current_page < currentPage + 2) {
      if (
        currentPage !== prevState.currentPage ||
        current_page !== prevProps.productSearch.current_page ||
        prevProps.productSearch.page_size !== productSearch.page_size
      ) {
        this.setState({
          pageItems: ceil(productsTotal / productSearch.page_size),
        });
        const { personalProduct } = this.state;
        const productRec = prop(personalProduct, 'product', '');
        if (
          isCustomerLogged &&
          customerId &&
          productRec &&
          productRec.length > 0
        ) {
          if (
            prevProps.productSearch.page_size === 30 &&
            productSearch.page_size === 20 &&
            current_page === 1
          ) {
            if (slug && slug.length) {
              this.fetchProduct(current_page + 2, false, slug);
            } else {
              this.fetchProduct(current_page + 2, false);
            }
          }
          if (productSearch.page_size === 30 && current_page === 1) {
            if (slug && slug.length) {
              this.fetchProduct(current_page + 1, false, slug);
            } else {
              this.fetchProduct(current_page + 1, false);
            }
          }
          if (current_page < pageItems && current_page > 1) {
            if (slug && slug.length) {
              this.fetchProduct(current_page + 2, false, slug);
            } else {
              this.fetchProduct(current_page + 2, false);
            }
          }
        }

        if (current_page < pageItems) {
          if (slug && slug.length) {
            this.fetchProduct(current_page + 1, false, slug);
          } else {
            this.fetchProduct(current_page + 1, false);
          }
        }
      }
    }

    if (this.props.products.length !== prevProps.products.length) {
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

  impressionEventProduct(diffProducts) {
    dataLayer.push(ProductImpression(diffProducts, 'Recommended for you'));
  }

  dsEventTracker(diffProducts) {
    const { customer } = this.props;
    const { url } = this.props.match;
    const userId = prop(customer, 'id', '0').toString();
    Object.keys(diffProducts).map(index => {
      const { sku, price } = diffProducts[index];
      return eventTracking(
        'impression',
        userId,
        sku,
        index,
        url,
        price,
        'recommendation',
      );
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { prevPage } = this.state;
    const currentPage = nextProps.productSearch.current_page;
    const pageSize = nextProps.productSearch.page_size;
    const { productsTotal } = nextProps;

    const fetchProductOver =
      nextProps.productsLoading === false &&
      currentPage * pageSize > productsTotal;
    const fetchFailed = nextProps.productsFailed;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');

    if (
      currentPage !== 1 &&
      currentPage > prevPage &&
      (fetchProductOver || fetchFailed)
    ) {
      this.setState({ hasMoreItems: false, prevPage: currentPage });
    }
    if (
      slug &&
      slug.length &&
      !isEmpty(nextProps.categories) &&
      isEmpty(this.props.categories)
    ) {
      this.fetchProduct(1, true, slug, nextProps.categories);
    }
  }

  renderBreadcrums() {
    const { translate, categories } = this.props;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      {
        label: translate('homepage.recommended'),
        url: '/recommended',
        isStatic: !slug,
      },
    ];

    if (slug && slug.length) {
      if (isEmpty(categories)) {
        return null;
      }

      const activeCategory = find(
        categories,
        cate => `/${cate.url_key}` === slug,
      );

      breadcrumbs.push({
        label: activeCategory.name,
        url: activeCategory.url_key,
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
              seo
            />
          ))}
        </Breadcrumb>
      </div>
    );
  }

  renderSorting() {
    const { sorting, translate, productsLoading } = this.props;

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

    return (
      <ProductSorting
        sorting={sorting.filter(
          el =>
            el.code === 'name' || el.code === 'price' || el.code === 'ranking',
        )}
        onClick={() => this.setState({ sortingOpen: !this.state.sortingOpen })}
        onSortByChange={this.onSortByChange}
        value={this.state.sort}
        sortingLabel={sortingLabel}
        loading={productsLoading}
        open={this.state.sortingOpen}
      />
    );
  }

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
      'recommendation',
    );
  };

  onSortByChange = (e, data) => {
    this.props.setActiveSorting(data.value);
    this.setState({ sort: data.value, sortingOpen: false });
  };

  fetchPageView(page) {
    const { pageItems, hasMoreItems, currentPage } = this.state;
    if (hasMoreItems === true && page < pageItems && page > currentPage) {
      this.setState({ currentPage: page });
    }
  }

  fetchProduct = async (
    page,
    reFetch,
    slug,
    categories = this.props.categories,
  ) => {
    const {
      fetchNewProducts,
      fetchProducts,
      fetchProductRecommendPersonal,
      location,
      customer,
    } = this.props;
    const parsedSearchQuery = queryString.parse(location.search);
    const customerId = prop(customer, 'id', 0);
    const filters = omit(parsedSearchQuery, [
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
    const sorting = this.state.sort;
    let field = 'recommended,1,eq';

    if (slug && slug.length) {
      if (isEmpty(categories)) {
        return;
      }

      const activeCategory = find(
        categories,
        cate => `/${cate.url_key}` === slug,
      );
      field = `category_id,${activeCategory.id},eq`;
      filters.recommended = 1;
    }

    const params = {
      page_size: 20,
      page_number: page,
      field,
      filters: JSON.stringify(filters),
      sort: sorting,
    };

    const { personalProduct } = this.state;

    if (!personalProduct) {
      const resPersonalProduct = await fetchProductRecommendPersonal(
        customerId,
      );
      this.setState({
        personalProduct: resPersonalProduct,
      });
      params.product_recommend = JSON.stringify(resPersonalProduct);
    } else {
      params.product_recommend = JSON.stringify(personalProduct);
    }

    if (reFetch) {
      fetchNewProducts(params);
    }

    fetchProducts(params);
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
    } = this.props;
    let allowKey = ['brand_name', 'promotion_type'];
    const ignoreKey = ['cat'];
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');
    let fixCategory = true;

    if (slug && slug.length) {
      allowKey = '*';
      fixCategory = false;
    }

    const filterAbleCate = filter(
      getActiveCategoryList(categories),
      cate => cate.level === 2,
    );

    let formatSubCate = filterAbleCate;
    const filterCtegory = find(filters, item => item.attribute_code === 'cat');

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

    const formatedFilter = this.props.formatFilter(filters);

    return (
      <ProductFilter
        filters={formatedFilter}
        badgeConfig={storeConfigDefault.extension_attributes}
        badgeBaseUrl={`${storeConfig.base_media_url}`}
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
        categoriesBaseUrl="/recommended/"
        labelCategory={translate('filter.category')}
        hideEmptyCategory
      />
    );
  }

  rendeXsFilter() {
    const { translate, productsLoading } = this.props;

    return (
      <div className="mobile-top-filter-bar">
        <div className="column filter">
          <button
            onClick={() =>
              this.setState({ filterOpen: !this.state.filterOpen })
            }
          >
            <span>
              <img src="/assets/icons/mobile-filter.png" alt="filter" />
            </span>
            <span>{translate('filter.label')}</span>
          </button>
        </div>
        <div className="column sorting">
          <button
            onClick={() =>
              this.setState({ sortingOpen: !this.state.sortingOpen })
            }
          >
            <span className="img">
              <img src="/assets/icons/mobile-sorting.png" alt="sorting" />
            </span>
            <span className="title">{translate('sorting.label')}</span>
            <span className="loader">
              <Loader active={productsLoading} inline size="mini" />
            </span>
          </button>
        </div>
        <div className="mobile-sorting-box">{this.renderSorting()}</div>
        <div className="mobile-filter-box">
          <Pusher
            className="mobile-pusher-filter"
            open={this.state.filterOpen}
            width={300}
            onBackdropClicked={this.closePusher}
            pusherHeader={
              <div className="pusher-header--filters">
                <span>
                  <img src="/assets/icons/mobile-filter.png" alt="filter" />
                </span>
                <span>{translate('filter.label')}</span>
              </div>
            }
            pusherFooter={
              <div className="pusher-footer--filters">
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

  renderProductList = () => {
    const { productsLoading, products, customer } = this.props;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');
    const userId = prop(customer, 'id', '0').toString();

    if (productsLoading && isEmpty(products)) {
      return <ProductListPreloader />;
    }

    if (isEmpty(products)) {
      return null;
    }

    return (
      <PreloadedProductGrid
        element={ref => (this.productLoader = ref)}
        loading={productsLoading}
        loadMore
        hasMoreItems={this.state.hasMoreItems && !productsLoading}
        onLoadmore={page => this.fetchProduct(page, false, slug)}
        onPreLoader={page => this.fetchPageView(page)}
        trackingSection="recommendation"
        trackingUserId={userId}
        section="Recommended for you"
        beforeAddProductCallback={this.beforeAddProductCallback}
      />
    );
  };

  render() {
    const { categories, storeConfig, banner, translate } = this.props;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/recommended', '');
    const filterAbleCate = filter(
      getActiveCategoryList(categories),
      cate => cate.level === 2,
    );
    return (
      <div
        id="recommended-page"
        className={`${slug && slug.length ? 'mobile-filterable' : ''}`}
      >
        <Layout title="Recommended">
          <MetaTags
            canonicalUrl={head(fullpathUrl(this.props.location).split('?'))}
            title={translate('meta_tags.recommended.title')}
            keywords={translate('meta_tags.recommended.keywords')}
            description={translate('meta_tags.recommended.description')}
          />

          <Tabbar />

          {this.rendeXsFilter()}

          {!(slug && slug.length) && (
            <SpSubCate
              subCateItem={filterAbleCate}
              className="sp-subcate"
              basePath="/recommended/"
            />
          )}

          {this.renderBreadcrums()}
          {!(slug && slug.length) && (
            <PreloadHeroBannerV2
              id="hero-banner-homepage"
              className="homepage"
              banner={prop(banner.data, '0', {})}
              config={storeConfig}
              loading={banner.isFetching}
            />
          )}

          <div id="filter-bar">{this.renderFilter()}</div>

          <div id="sorting-bar">{this.renderSorting()}</div>

          {this.renderProductList()}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  cmsBlock: state.cmsBlock.items,
  products: state.product.items,
  sorting: state.product.sorting,
  activeSorting: state.product.activeSorting,
  filters: state.product.filters,
  productsLoading: state.product.loading,
  productsTotal: state.product.total_count,
  productsFailed: state.product.failed,
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  productSearch: state.product.search_criteria,
  categories: state.category.items,
  payment: state.checkout.payment,
  isCustomerLogged: isCustomerLoggedSelector(state),
  customer: state.customer.items,
  cart: state.cart.cart,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchProducts: search => dispatch(fetchProduct(search)),
  fetchNewProducts: search => dispatch(fetchNewProduct(search)),
  fetchProductRecommendPersonal: product_recommend =>
    dispatch(fetchProductRecommendPersonal(product_recommend)),
  setActiveSorting: data => dispatch(setActiveSorting(data, ownProps)),
  setActiveFilter: data => dispatch(setActiveFilter(data, ownProps)),
  resetFilter: () => dispatch(resetFilter(ownProps)),
  formatFilter: filters => dispatch(formatFilter(filters)),
  clearProductProp: () => dispatch(clearProductProp()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withBannerByName(Recommended, 'Recommended')),
);
