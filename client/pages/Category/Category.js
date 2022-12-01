import Cookies from 'js-cookie';
import {
  ceil,
  compact,
  difference,
  filter,
  find,
  get as prop,
  head,
  isEmpty,
  map,
  omit,
  orderBy,
  reduce,
  size,
  split,
  unescape,
} from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import Breadcrumbs from '@client/components/Breadcrumbs';
import Layout from '@client/components/Layout';
import MetaTags from '@client/components/MetaTags';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import PreloadedProductGrid from '@client/components/PreloadedProductGrid';
import {
  BreadcrumbPreloader,
  PagePreloader,
  ProductListPreloader,
} from '@client/components/PreloaderComponent';
import SpSubCate, { SubCategoryPreloader } from '@client/components/SpSubCate';
import Tabbar from '@client/components/Tabbar';
import { BannerListContainer } from '@client/features/banner';
import {
  fetchCategoryDetail,
  findCategoryKeys,
} from '@client/features/category/detail';
import { ProductImpression } from '@client/features/gtm/models/Product';
import withCategories from '@client/hoc/withCategories';
import withLocales from '@client/hoc/withLocales';
import {
  Breadcrumb,
  Button,
  Loader,
  ProductFilter,
  ProductSorting,
  Pusher,
} from '@client/magenta-ui';
import { RestrictModal } from '@client/pages/Category/RestrictModal';
import { fetchBannerByCategory } from '@client/reducers/banner';
import { checkDefaultShipping } from '@client/reducers/cart';
import { fetchProductInSubcategory } from '@client/reducers/category';
import {
  clearProductProp,
  fetchNewProduct,
  fetchProduct,
  fetchProductByCategorySet,
  formatFilter,
  resetFilter,
  setActiveFilter,
  setActiveSorting,
} from '@client/reducers/product';
import { fetchWishlist } from '@client/reducers/wishlist';
import { getActiveCategoryList } from '@client/utils/category';
import { checkDate } from '@client/utils/dayjs';
import { getImageNameFromSrc } from '@client/utils/gtmDataAttr';
import { fullpathUrl } from '@client/utils/url';

import './Category.scss';

@withLocales
@withCategories
class Category extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    productSearch: PropTypes.object.isRequired,
    productsTotal: PropTypes.number.isRequired,
    category: PropTypes.object,
    fetchProducts: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    subCategories: PropTypes.array.isRequired,
    storeConfig: PropTypes.object.isRequired,
    productsLoading: PropTypes.bool.isRequired,
    translate: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    sorting: PropTypes.array.isRequired,
    clearProductProp: PropTypes.func.isRequired,
    fetchWishlist: PropTypes.func.isRequired,
    fetchProductByCategorySet: PropTypes.func.isRequired,
    cmsBlock: PropTypes.array,
    fetchCategoryDetail: PropTypes.func.isRequired,
    categoryKeys: PropTypes.object.isRequired,
    fetchProductInSubcategory: PropTypes.func.isRequired,
    productSets: PropTypes.object,
    productSetsLoading: PropTypes.bool,
    urlRewrite: PropTypes.object.isRequired,
  };

  static defaultProps = {
    category: null,
    cmsBlock: {},
    productSetsLoading: false,
    productSets: [],
  };

  state = {
    sort: queryString.parse(this.props.location.search).sort || 'ranking,desc',
    sortingOpen: false,
    filterOpen: false,
    hasMoreItems: false,
    alcoholPopup: false,
    currentPage: 0,
    pageItems: 1,
  };

  componentDidMount() {
    const { category } = this.props;

    this.verifyCategoryAlcohol();

    if (size(this.props.categories) <= 0) {
      this.props.fetchCategory();
    }

    if (category) {
      this.fetchInitialData();
    }

    this.props.fetchWishlist();
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps, prevState) {
    const { category, productsTotal, productSearch } = this.props;
    const { page_size, current_page } = productSearch;
    const { currentPage } = this.state;

    this.verifyCategoryAlcohol();

    if (
      size(this.props.categories) > 0 &&
      size(prevProps.categories) !== size(this.props.categories)
    ) {
      this.props.fetchCategory();
    }

    if (category) {
      if (!prevProps.category && this.props.category) {
        this.fetchInitialData();

        this.props.fetchWishlist();
        window.scrollTo(0, 0);
      }

      if (prevProps.match.url !== this.props.match.url) {
        this.fetchInitialData();
        window.scrollTo(0, 0);
      } else if (prevProps.location.search !== this.props.location.search) {
        if (category.level !== 2) {
          this.fetchInitialData();
        }
      }

      if (prevProps.location.pathname !== this.props.location.pathname) {
        if (this.filters) this.filters.resetIndex();
      }

      if (!Cookies.get('alcohol_close_popup')) {
        if (Number(category.is_alcohol_restriction)) {
          this.setState({ alcoholPopup: true });

          Cookies.set('alcohol_close_popup', 1, { expires: 1 });
        }
      }

      if (
        current_page !== prevProps.productSearch.current_page &&
        category.level > 2 &&
        current_page !== undefined
      ) {
        const currentProd = Object.values(this.props.products).map(
          (item, index) => {
            item['order'] = index;
            return item;
          },
        );

        const prevProd = Object.values(prevProps.products).map(
          (item, index) => {
            item['order'] = index;
            return item;
          },
        );
        const diffProducts = difference(currentProd, prevProd);
        if (diffProducts.length > 0) {
          this.impressionEventProduct(diffProducts, current_page);
        }
      }

      if (category.level > 2) {
        if (current_page && current_page < currentPage + 2) {
          if (
            currentPage !== prevState.currentPage ||
            current_page !== prevProps.productSearch.current_page
          ) {
            this.setState({ pageItems: ceil(productsTotal / page_size) });
            this.fetchProduct(category.id, current_page + 1);
          }
        }
      }
    }
  }

  verifyCategoryAlcohol = () => {
    if (checkDate('2020-12-06 16:50')) {
      const splitUrl = split(this.props.match.url, '/');
      if (splitUrl?.length > 1 && splitUrl[1] === 'beer-wine-and-spirits') {
        this.props.history.push(`/online-alcohol-products`);
      }
    }
  };

  addGtmClass = async () => {
    const element = await ReactDOM.findDOMNode(this.cmsContainer);
    const bannerLocationFooter =
      this.props.location.pathname.split('/').pop() || '-';
    if (element) {
      const images = element.querySelectorAll('img');
      const aLink = element.querySelectorAll('a');
      for (let i = 0; i < images.length; i++) {
        const imageName =
          getImageNameFromSrc(images[i].getAttribute('src')) || '';
        const bannerId = `PLP|${bannerLocationFooter}|Category CMS Block`;
        const bannerName = `${bannerId}|${imageName}|${aLink[i]}`;
        images[i].setAttribute('databanner-id', bannerId);
        images[i].setAttribute('databanner-name', bannerName);
        images[i].setAttribute('databanner-position', i + 1);
      }
    }
  };

  categoryPathEvent() {
    let categoryPath = '';
    if (this.props.category.level === 2) {
      categoryPath = prop(this.props.category, 'name', '');
    }
    if (this.props.category.level >= 3) {
      // Push parent first
      const parentId = this.props.category.parent_id;
      const parentCateg = find(
        this.props.categories,
        categ => categ.id === parentId,
      );
      categoryPath = `${prop(parentCateg, 'name', '')} > ${prop(
        this.props.category,
        'name',
        '',
      )}`;

      if (this.props.category.level === 4) {
        const mainCateg = find(
          this.props.categories,
          categ => categ.id === parentCateg.parent_id,
        );
        categoryPath = `${prop(mainCateg, 'name', '')} > ${prop(
          parentCateg,
          'name',
          '',
        )} > ${prop(this.props.category, 'name')}`;
      }
    }

    dataLayer.push({
      category_path: categoryPath,
    });
  }

  impressionEventProduct(diffProducts) {
    dataLayer.push(
      ProductImpression(
        diffProducts,
        `Category${this.props.location.pathname}`,
      ),
    );
  }

  fetchInitialData() {
    this.props.clearProductProp();
    if (this.props.category && this.props.category.level === 2) {
      const urlRewriteId = prop(
        this.props.urlRewrite,
        `${this.props.match.params.slug}.entity_id`,
        '',
      ).toString();
      this.props.fetchProductInSubcategory(
        this.props.match.params.slug,
        urlRewriteId,
      );
    }
    this.setState({ hasMoreItems: true, currentPage: 1 });
    this.fetchProduct(this.props.category.id, 1);
    this.categoryPathEvent();
    this.addGtmClass();
  }

  fetchProductBySubCate() {
    if (this.props.category) {
      const categorySet = this.props.subCategories.map(item => item.id);
      categorySet.unshift(this.props.category.id);
      const cateString = categorySet.toString();
      const params = {
        categories: cateString,
        page_size: 20,
        page_number: 1,
      };

      this.props.fetchProductByCategorySet(params);
    }
  }

  fetchPageView(page) {
    const { pageItems, hasMoreItems, currentPage } = this.state;
    if (hasMoreItems === true && page < pageItems && page > currentPage) {
      this.setState({ currentPage: page });
    }
  }

  fetchProduct(id, page) {
    const { location } = this.props;

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

    const params = {
      field: `category.category_id,${id},eq`,
      page_size: 20,
      page_number: page,
      filters: JSON.stringify(filters),
      sort: this.state.sort,
    };

    this.props.fetchProducts(params);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { productsTotal } = nextProps;
    const currentPage = nextProps.productSearch.current_page;
    const pageSize = nextProps.productSearch.page_size;

    const fetchProductOver =
      nextProps.productsLoading === false &&
      currentPage * pageSize > productsTotal;

    if (fetchProductOver) {
      this.setState({ hasMoreItems: false });
    }
  }

  renderBreadcrums() {
    const { translate } = this.props;

    const breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
    ];

    if (this.props.category.level >= 3) {
      // Push parent first
      const parentId = this.props.category.parent_id;
      const parentCateg = find(
        this.props.categories,
        categ => categ.id === parentId,
      );

      if (this.props.category.level === 4) {
        const mainCateg = find(
          this.props.categories,
          categ => categ.id === parentCateg.parent_id,
        );

        if (mainCateg) {
          breadcrumbs.push({
            label: mainCateg.name,
            url: `/${mainCateg.url_path}`,
          });
        }
      }

      if (parentCateg && parentCateg.url_path !== 'collection') {
        breadcrumbs.push({
          label: parentCateg.name,
          url: `/${parentCateg.url_path}`,
        });
      }
    }
    // Push current category
    breadcrumbs.push({
      label: this.props.category.name,
      url: `/${this.props.category.url_path}`,
      isStatic: true,
    });

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
              seo={index === breadcrumbs.length - 1}
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
    this.props.setActiveSorting(data.value);
    this.setState({ sort: data.value, sortingOpen: false });
  };

  renderFilter(type) {
    const {
      productsLoading,
      translate,
      storeConfigDefault,
      setActiveFilter,
      resetFilter,
      filters,
      category,
      subCategories,
    } = this.props;

    let allowKey = [];
    const ignoreKey = ['cat'];
    let fixCategory = true;

    if (category.level === 3) allowKey = ['brand_name'];
    if (category.level === 4) {
      fixCategory = false;
      allowKey = '*';
    }

    let formatSubCate = subCategories;
    const filterCtegory = find(filters, item => item.attribute_code === 'cat');

    if (filterCtegory) {
      formatSubCate = map(subCategories, subCate => {
        const currentCateFilter = find(
          filterCtegory.items,
          filterCate => filterCate.value == subCate.id,
        );

        if (currentCateFilter) {
          subCate.product_count = currentCateFilter.item_count;
        }
        return subCate;
      });
    }

    const formatedFilter = this.props.formatFilter(filters);

    return (
      <ProductFilter
        badgeBaseUrl={storeConfigDefault.base_media_url}
        ref={node => (this.filters = node)}
        filters={formatedFilter}
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
        hideEmptyCategory
      />
    );
  }

  renderMobileSubCate = () => {
    const { category, filters } = this.props;
    let component = null;
    const subCategoryList = this.props.subCategories;
    const loading = this.props.productsLoading;

    if (loading && category.level <= 3) {
      return <SubCategoryPreloader />;
    }
    if (loading) {
      return null;
    }

    if (category.level <= 3) {
      const filterCtegory = find(
        filters,
        item => item.attribute_code === 'cat',
      );
      let formatSubCate = subCategoryList;

      if (filterCtegory) {
        formatSubCate = reduce(
          subCategoryList,
          (result, subCate) => {
            const currentCateFilter = find(
              filterCtegory.items,
              filterCate => filterCate.value == subCate.id,
            );
            const currentItemCount = currentCateFilter
              ? currentCateFilter.item_count
              : 0;

            if (currentItemCount > 0) {
              result.push(subCate);
            }

            return result;
          },
          [],
        );
      }

      component = (
        <SpSubCate subCateItem={formatSubCate} className="sp-subcate" />
      );
    }

    return component;
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

  closeAlcoholPopup = () => this.setState({ alcoholPopup: false });

  handleOnScreen = async subCategId => {
    const { categoryKeys } = this.props;
    const { sort } = this.state;
    if (prop(categoryKeys, `${subCategId}.isReload`, true)) {
      this.props.fetchCategoryDetail(subCategId, sort);
    }
  };

  renderProductList() {
    const {
      category,
      subCategories,
      productsLoading,
      products,
      filters,
      categoryKeys,
      productSets,
      productSetsLoading,
    } = this.props;

    if (productsLoading && isEmpty(products)) {
      return <ProductListPreloader />;
    }

    if (category && category.level === 2) {
      let formatSubCate = [];
      const filterCtegory = find(
        filters,
        item => item.attribute_code === 'cat',
      );

      if (filterCtegory) {
        formatSubCate = reduce(
          subCategories,
          (result, subCate) => {
            const currentCateFilter = find(
              filterCtegory.items,
              filterCate => filterCate.value == subCate.id,
            );
            const itemCount = prop(currentCateFilter, 'item_count', 0);

            if (itemCount > 0) {
              result.push(subCate);
            }

            return result;
          },
          [],
        );
      }

      return formatSubCate.map(subCateg => {
        const findProduct = find(productSets, {
          categoryId: subCateg.id.toString(),
        });
        return (
          <PreloadedProductCarousel
            id={String(subCateg.id)}
            ownProducts={prop(categoryKeys, `${subCateg.id}.data`, [])}
            productSets={prop(findProduct, 'products.items')}
            min={-1}
            loading={
              prop(categoryKeys, `${subCateg.id}.isFetching`, false) ||
              productSetsLoading
            }
            title={subCateg.name}
            button
            url={`/${subCateg.url_path}`}
            section={`Category/${subCateg.url_key}`}
            isCustomSlide
          />
        );
      });
    }
    return (
      <PreloadedProductGrid
        element={ref => (this.productLoader = ref)}
        loading={this.props.productsLoading}
        loadMore
        hasMoreItems={this.state.hasMoreItems && !this.props.productsLoading}
        onLoadmore={
          category.level && category.level >= 3
            ? page => this.fetchProduct(category.id, page)
            : undefined
        }
        onPreLoader={
          category.level && category.level > 2
            ? page => this.fetchPageView(page)
            : undefined
        }
        section={`Category/${category.url_path}`}
      />
    );
  }

  filterCMSBlock(id) {
    const data = this.props.cmsBlock;
    const baseMediaUrl = this.props.storeConfig.base_media_url;
    let content = '';

    if (data.length > 0) {
      const filterData = filter(data, val => {
        return val.id === id && val.active === true;
      });

      filterData.map(resp => {
        content = unescape(resp.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      });
    }

    return content;
  }

  renderCMSContent(id) {
    const cmsBlock = this.filterCMSBlock(id);

    if (cmsBlock.length > 0) {
      return (
        <div
          ref={node => (this.cmsContainer = node)}
          className="category-cms-block"
          dangerouslySetInnerHTML={{ __html: cmsBlock }}
        />
      );
    }

    return '';
  }

  render() {
    const { category, match, storeConfig, cmsBlock } = this.props;
    const baseMediaUrl = storeConfig.base_media_url;
    let alcoholPopup = {};
    const categoryId = prop(category, 'id', 0);

    if (isEmpty(category)) {
      return (
        <Layout pageType="category" isLoading>
          <Tabbar location={this.props.location} />
          <BreadcrumbPreloader />
          <PagePreloader />
        </Layout>
      );
    }

    let content = '';
    if (category && Number(category.is_alcohol_restriction)) {
      alcoholPopup = find(cmsBlock, data => {
        return data.id.toString() === category.alcohol_cms_popup;
      });

      if (alcoholPopup) {
        content = unescape(alcoholPopup.content)
          .replace(/{{media url="/g, baseMediaUrl)
          .replace(/"}}/g, '');
      }
    }

    let ogImage = '';
    if (category && !isEmpty(category.og_image)) {
      ogImage = `${baseMediaUrl}catalog/category/${category.og_image}`;
    }
    return (
      <div
        id="category-page"
        className={`category-page level-${category.level}`}
      >
        <MetaTags
          canonicalUrl={head(fullpathUrl(this.props.location).split('?'))}
          title={`${category.meta_title || category.name}`}
          description={`${category.meta_description || category.name}`}
          keywords={`${category.meta_keywords || category.name}`}
          imageUrl={ogImage}
          ogTitle={`${category.meta_title || category.name}`}
          ogDescription={`${category.meta_description || category.name}`}
        />
        <Layout
          pageType="category"
          activeCategory={match.params.slug}
          className="category-page"
          title={<h1>{category.name}</h1>}
        >
          <Tabbar location={this.props.location} />
          {this.rendeXsFilter()}
          <RestrictModal
            open={this.state.alcoholPopup}
            content={content}
            onClosePopup={() => this.closeAlcoholPopup()}
          />
          {this.renderMobileSubCate()}
          {this.renderBreadcrums()}
          {categoryId && <BannerListContainer categoryId={categoryId} />}

          {this.renderCMSContent(parseInt(prop(category, 'landing_page'), 0))}

          <div id="filter-bar">{this.renderFilter()}</div>

          {category.level !== 2 && (
            <div id="sorting-bar">{this.renderSorting()}</div>
          )}

          {this.renderProductList()}
          <div className="insider-sr-category"></div>
        </Layout>
      </div>
    );
  }
}

const fetchChildren = (categories, urlPath, urlRewriteId) => {
  let subCategories = [];

  try {
    const category = find(
      categories,
      categ => categ.url_path === urlPath && categ.entity_id === urlRewriteId,
    );
    const childrens = category.children.split(',');
    let subCateList = childrens.map(childrenId => {
      return find(categories, categ => categ.id.toString() === childrenId);
    });

    subCateList = orderBy(subCateList, 'position', 'asc');
    subCategories = getActiveCategoryList(compact(subCateList));
  } catch (e) {
    subCategories = [];
  }

  return subCategories;
};

const mapStateToProps = (state, ownProps) => ({
  translate: getTranslate(state.locale),
  payment: state.checkout.payment,
  cart: state.cart.cart,
  products: state.product.items,
  sorting: state.product.sorting,
  filters: state.product.filters,
  productsLoading: state.product.loading,
  productsTotal: state.product.total_count,
  productsFailed: state.product.failed,
  storeConfig: state.storeConfig.current,
  storeConfigDefault: state.storeConfig.default,
  productSearch: state.product.search_criteria,
  category: find(
    state.category.items,
    categ =>
      categ.url_path === ownProps.match.params.slug &&
      categ.entity_id ===
        prop(
          state.urlRewrite,
          `pathesMap.${ownProps.match.params.slug}.entity_id`,
          '',
        ).toString(),
  ),
  categories: state.category.items,
  categoryLoading: state.category.loading,
  subCategories: fetchChildren(
    state.category.items,
    ownProps.match.params.slug,
    prop(
      state.urlRewrite,
      `pathesMap.${ownProps.match.params.slug}.entity_id`,
      '',
    ).toString(),
  ),
  banners: state.banner.items,
  bannerLoading: state.banner.loading,
  cmsBlock: state.cmsBlock.items,
  categoryKeys: findCategoryKeys(state),
  productSets: state.category.productSets,
  productSetsLoading: state.category.loadingProductSets,
  urlRewrite: state.urlRewrite.pathesMap,
});

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      fetchProducts: fetchProduct,
      fetchNewProduct,
      clearProductProp,
      fetchWishlist,
      resetFilter: () => resetFilter(ownProps),
      setActiveFilter: data => setActiveFilter(data, ownProps),
      setActiveSorting: data => setActiveSorting(data, ownProps),
      fetchProductByCategorySet,
      fetchBannerByCategory,
      formatFilter,
      fetchCategoryDetail,
      fetchProductInSubcategory: (urlPath, urlRewriteId) =>
        fetchProductInSubcategory(urlPath, urlRewriteId),
      checkDefaultShipping,
    },
    dispatch,
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Category),
);
