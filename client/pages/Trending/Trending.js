import {
  ceil,
  difference,
  filter,
  find,
  isEmpty,
  map,
  omit,
  size,
} from 'lodash';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';

import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout';
import MetaTags from '../../components/MetaTags';
import PreloadedProductGrid from '../../components/PreloadedProductGrid';
import { ProductListPreloader } from '../../components/PreloaderComponent';
import PreloadHeroBannerV2 from '../../components/PreloadHeroBannerV2';
import SpSubCate from '../../components/SpSubCate';
import Tabbar from '../../components/Tabbar';
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
import { fetchBanner } from '../../reducers/banner';
import { checkDefaultShipping } from '../../reducers/cart';
import {
  clearProductProp,
  fetchNewProduct,
  fetchPromotions,
  formatFilter,
  resetFilter,
  setActiveFilter,
  setActiveSorting,
} from '../../reducers/product';
import { getActiveCategoryList } from '../../utils/category';

@withCategories
class Trending extends PureComponent {
  state = {
    sort: queryString.parse(this.props.location.search).sort || 'ranking,desc',
    sortingOpen: false,
    filterOpen: false,
    hasMoreItems: false,
    currentPage: 0,
    pageItems: 1,
  };

  componentDidMount() {
    const { categories } = this.props;

    if (size(this.props.categories) <= 0) {
      this.props.fetchCategory();
    }
    //const slug = match.params.slug;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/promotion', '');
    window.scrollTo(0, 0);
    this.props.clearProductProp();
    this.props.fetchBanner('Trending');

    if (slug && slug.length) {
      if (!isEmpty(categories)) {
        this.fetchProduct(1, true, slug);
      }
    } else {
      this.fetchProduct(1, true);
    }

    this.setState({ hasMoreItems: true });
  }

  componentDidUpdate(prevProps, prevState) {
    const { pathname } = this.props.location;
    const slug = pathname.replace('/promotion', '');
    const { productsTotal, productSearch } = this.props;
    const { page_size, current_page } = productSearch;
    const { currentPage, pageItems } = this.state;

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

      if (slug) {
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
      if (slug) {
        this.fetchProduct(1, true, slug);
      } else {
        this.fetchProduct(1, true);
      }
    }

    if (
      current_page !== prevProps.productSearch.current_page &&
      current_page !== undefined
    ) {
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
        this.impressionEventProduct(diffProducts, current_page);
      }
    }

    if (current_page && current_page < currentPage + 2) {
      if (
        currentPage !== prevState.currentPage ||
        current_page !== prevProps.productSearch.current_page ||
        prevProps.productSearch.page_size !== productSearch.page_size
      ) {
        this.setState({ pageItems: ceil(productsTotal / page_size) });
        if (current_page < pageItems) {
          if (slug) {
            this.fetchProduct(current_page + 1, false, slug);
          } else {
            this.fetchProduct(current_page + 1, false);
          }
        }
      }
    }
  }

  impressionEventProduct(diffProducts) {
    dataLayer.push(ProductImpression(diffProducts, 'Promotion this week'));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const currentPage = nextProps.productSearch.current_page;
    const pageSize = nextProps.productSearch.page_size;
    const { productsTotal } = nextProps;

    const fetchProductOver =
      nextProps.productsLoading === false &&
      currentPage * pageSize > productsTotal;
    const fetchFailed = nextProps.productsFailed;

    const { pathname } = this.props.location;
    const slug = pathname.replace('/promotion', '');

    if (fetchProductOver || fetchFailed) {
      this.setState({ hasMoreItems: false });
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
    const slug = pathname.replace('/promotion', '');

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
      {
        label: translate('homepage.promotion'),
        url: '/promotion',
        isStatic: !slug,
      },
    ];

    if (slug && slug.length) {
      if (isEmpty(categories)) {
        return null;
      }

      const activeCategory = find(categories, cate => {
        return `/${cate.url_key}` === slug && cate.level === 2;
      });

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

  onSortByChange = (e, data) => {
    this.props.clearProductProp();
    this.props.setActiveSorting(data.value);
    this.setState({ sort: data.value, sortingOpen: false });
  };

  fetchPageView(page) {
    const { pageItems, hasMoreItems, currentPage } = this.state;
    if (hasMoreItems === true && page < pageItems && page > currentPage) {
      this.setState({ currentPage: page });
    }
  }

  fetchProduct = (page, reFetch, slug, categories = this.props.categories) => {
    const { fetchPromotions, location } = this.props;
    const parsedSearchQuery = queryString.parse(location.search);
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
    let field = `promotion_type,${encodeURIComponent(
      'Sale,Red Hot,BOGO,B2G1,B3G1,B1GV,B2GV,B3GV',
    )},in`;

    if (slug && slug.length) {
      if (isEmpty(categories)) {
        return;
      }

      const activeCategory = find(categories, cate => {
        return `/${cate.url_key}` === slug && cate.level === 2;
      });
      field = `category_id,${activeCategory.id},eq`;
      filters.promotion_type = !isEmpty(filters)
        ? filters.promotion_type
        : 'Sale,Red Hot,BOGO,B2G1,B3G1,B1GV,B2GV,B3GV';
    }

    const params = {
      page_size: 20,
      page_number: page,
      field,
      filters: JSON.stringify(filters),
      sort: sorting,
    };

    if (reFetch) return fetchPromotions(params);

    fetchPromotions(params);
  };

  renderFilter(type) {
    const {
      storeConfig,
      productsLoading,
      translate,
      storeConfigDefault,
      resetFilter,
      filters,
      categories,
    } = this.props;
    let allowKey = ['brand_name', 'promotion_type'];
    const ignoreKey = ['cat'];
    let fixCategory = true;

    const { pathname } = this.props.location;
    const slug = pathname.replace('/promotion', '');

    if (slug.length) {
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
        onFilterChange={(e, data) => this.onChangeFilter(data)}
        onFilterReset={resetFilter}
        disabled={productsLoading}
        type={type || 'tab'}
        nodataMessage={translate('filter.empty')}
        labelResetButton={translate('filter.reset')}
        fixCategory={fixCategory}
        categories={formatSubCate}
        categoriesBaseUrl="/promotion/"
        labelCategory={translate('filter.category')}
        hideEmptyCategory
      />
    );
  }

  onChangeFilter = data => {
    this.props.clearProductProp();
    this.props.setActiveFilter(data);
  };

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
    const { productsLoading, products } = this.props;
    const { pathname } = this.props.location;
    const slug = pathname.replace('/promotion', '');

    if (productsLoading && isEmpty(products)) {
      return <ProductListPreloader />;
    }

    if (isEmpty(products)) {
      return null;
    }

    return (
      <PreloadedProductGrid
        element={ref => (this.productLoader = ref)}
        loading={this.props.productsLoading}
        loadMore
        hasMoreItems={this.state.hasMoreItems && !this.props.productsLoading}
        onLoadmore={page => this.fetchProduct(page, false, slug)}
        onPreLoader={page => this.fetchPageView(page)}
        section="Promotion this week"
      />
    );
  };

  render() {
    const { match, categories, banner, storeConfig, translate } = this.props;
    const { slug } = match.params;
    const filterAbleCate = filter(
      getActiveCategoryList(categories),
      cate => cate.level === 2,
    );

    return (
      <div
        id="trending-page"
        className={`${match.params.slug ? 'mobile-filterable' : ''}`}
      >
        <MetaTags
          title={translate('meta_tags.trending.title')}
          description={translate('meta_tags.trending.description')}
          keywords={translate('meta_tags.trending.keywords')}
        />
        <Layout title={translate('homepage.promotion')}>
          <Tabbar />

          {this.rendeXsFilter()}

          {!match.params.slug && (
            <SpSubCate
              subCateItem={filterAbleCate}
              className="sp-subcate"
              basePath="/promotion/"
            />
          )}

          {this.renderBreadcrums()}

          {!slug && (
            <PreloadHeroBannerV2
              id="hero-banner-homepage"
              className="homepage"
              banner={banner[0]}
              config={storeConfig}
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
  banner: state.banner.items,
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
  cart: state.cart.cart,
  urlRewrite: state.urlRewrite.pathesMap,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchNewProducts: search => dispatch(fetchNewProduct(search)),
  fetchPromotions: search => dispatch(fetchPromotions(search)),
  setActiveSorting: data => dispatch(setActiveSorting(data, ownProps)),
  setActiveFilter: data => dispatch(setActiveFilter(data, ownProps)),
  resetFilter: () => dispatch(resetFilter(ownProps)),
  fetchBanner: name => dispatch(fetchBanner(name)),
  formatFilter: filters => dispatch(formatFilter(filters)),
  checkDefaultShipping: product => dispatch(checkDefaultShipping(product)),
  clearProductProp: () => dispatch(clearProductProp()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trending);
