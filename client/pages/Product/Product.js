import compact from 'lodash/compact';
import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import take from 'lodash/take';
import unescape from 'lodash/unescape';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Breadcrumbs from '@client/components/Breadcrumbs';
import Layout from '@client/components/Layout';
import MetaTags from '@client/components/MetaTags';
import NotifyTooltip from '@client/components/NotifyTooltip';
import PreloadedProductCarousel from '@client/components/PreloadedProductCarousel';
import {
  BreadcrumbPreloader,
  ProductPreloader,
} from '@client/components/PreloaderComponent';
import {
  PromoBadgesIcons,
  PromoBadgesNames,
} from '@client/components/PromoBadge';
import PromoBundleList from '@client/components/PromoBundleList';
import { Desktop, Tablet } from '@client/components/Responsive';
import Tabbar from '@client/components/Tabbar';
import { deeplinkPDP } from '@client/features/deeplink/redux/deeplinkActions';
import {
  ProductAddAttribute,
  ProductNoQty,
} from '@client/features/gtm/models/Product';
import CartActionButton from '@client/features/product/components/CartActionButton';
import SimAndAssoProductCarousel from '@client/features/product/components/SimAndAssoProductCarousel';
import { findProductBySlug } from '@client/features/product/detail';
import { fetchProductDetail } from '@client/features/product/detail/redux/productDetailActions';
import {
  Accordion,
  Breadcrumb,
  Icon,
  Image,
  SwatchImages,
  SwatchImagesSlider,
} from '@client/magenta-ui';
import NotFound from '@client/pages/NotFound';
import { checkDefaultShipping } from '@client/reducers/cart';
import {
  fetchProductBundle,
  fetchProductByFilter,
} from '@client/reducers/product';
import {
  addtoWishlist,
  fetchWishlist,
  removeFromWishlist,
} from '@client/reducers/wishlist';
import {
  getCustomerSelector,
  getWishlistItmesByProductId,
} from '@client/selectors';
import { eventTracking } from '@client/utils/datalakeTracking';
import { fieldConditions as Conditions } from '@client/utils/maqb';
import Exploder from '@client/utils/mcaex';
import { formatPrice } from '@client/utils/price';
import { promoAvailableForBundleLink } from '@client/utils/promoBundle';
import { createDate } from '@client/utils/time';
import { fullpathUrl } from '@client/utils/url';

import './Products.scss';

class ProductPage extends PureComponent {
  state = {
    descriptionActive: true,
    specificationActive: true,
    promotionBundle: true,
    productBundle: [],
    productRecommended: [],
    productSimilarity: [],
    productSimilarityTitle: '',
    productAssociation: [],
    productAssociationTitle: '',
    product: null,
    description: '',
    message: '',
    limitDate: '',
    deepLink: '',
    title: '',
  };

  componentDidMount = async () => {
    window.scrollTo(0, 0);
    const { isReload, match, productDataLayer, similar } = this.props;
    if (!isEmpty(get(match, 'params.slug', ''))) {
      this.props.fetchProductDetail(match.params.slug);
    }
    if (!isReload && productDataLayer) {
      // Data Layer
      setTimeout(() => {
        dataLayer.push({
          event: 'eec.ProductDetail',
          typepage: 'detail',
          ecommerce: {
            currencyCode: 'THB',
            detail: {
              products: [productDataLayer],
            },
          },
        });
      }, 1000); // Delay Data Layer 1 sec
    }

    this.props.fetchWishlist(this.props.match.params.slug);
    this.props
      .fetchProductByFilter(
        'recommended',
        1,
        Conditions.EQUAL,
        'recommended_sort_order,asc',
      )
      .then(value => {
        this.setState({
          productRecommended: get(value, 'items', []),
        });
      });

    const product_association = find(
      get(similar, 'product_similarity'),
      obj => {
        return obj.id === 2;
      },
    );

    const product_similarity = find(get(similar, 'product_similarity'), obj => {
      return obj.id === 1;
    });
    const association = get(product_association, 'items');
    const similarity = get(product_similarity, 'items');
    if (!isEmpty(similar)) {
      this.dsEventTracker(association, 'association');
      this.dsEventTracker(similarity, 'similarity');
    }
  };

  componentDidUpdate(prevProps) {
    const { product, similar } = this.props;
    if (prevProps.match.url !== this.props.match.url) {
      window.scrollTo(0, 0);
      this.props.fetchProductDetail(this.props.match.params.slug);
    }
    if (!isEqual(prevProps.product, product)) {
      this.getDeepLink(product);
    }
    const product_association = find(
      get(similar, 'product_similarity'),
      obj => {
        return obj.id === 2;
      },
    );

    if (!isEqual(prevProps.product, product)) {
      const currentProductPromoNo = get(
        product,
        'extension_attributes.promotion.promotion_no',
        '',
      );

      if (!isEmpty(currentProductPromoNo)) {
        this.props.fetchProductBundle(currentProductPromoNo);
      }
    }

    const product_similarity = find(get(similar, 'product_similarity'), obj => {
      return obj.id === 1;
    });
    const association = get(product_association, 'items');
    const similarity = get(product_similarity, 'items');
    if (prevProps.similar !== similar) {
      this.dsEventTracker(association, 'association');
      this.dsEventTracker(similarity, 'similarity');
    }
  }

  dsEventTracker(diffProducts, type) {
    const { customer } = this.props;
    const { url } = this.props.match;
    const userId = get(customer, 'id', '0').toString();
    if (!isEmpty(diffProducts) && diffProducts.length > 0) {
      Object.keys(diffProducts).map(index => {
        const { sku, price } = diffProducts[index];
        eventTracking('impression', userId, sku, index, url, price, type);
      });
    }
  }

  getDeepLink = async product => {
    const { translate, envConfig } = this.props;
    const title =
      get(product, 'meta_title', false) ||
      `${product.name} | ${translate('product.meta.tops_online')}`;
    const image = get(product, 'image', '');
    const sku = get(product, 'sku', '');
    const url_key = get(product, 'url_key', '');
    const description =
      get(product, 'meta_description', false) ||
      `${translate('product.meta.shop_online')} ${product.name} ${translate(
        'product.meta.from',
      )} ${this.getCustomAttribute('brand_name') || ''} ${get(
        product,
        'breadcrumbs.2.name',
        '',
      )} ${translate('product.meta.tops_online')}`;
    const appId = get(envConfig, 'facebookID');
    const prodData = {
      title,
      image,
      description,
      appId,
      sku,
      url_key,
    };
    const deepLinkPDP = await this.props.deeplinkPDP(prodData);
    this.setState({
      deepLink: deepLinkPDP,
      title: prodData.title,
    });
  };

  getImageUrl = image =>
    `${this.props.storeConfig.base_media_url}/catalog/product${image}`;

  getCustomAttribute = attrName => {
    return get(
      find(
        this.props.product.custom_attributes_option,
        attr => attr.attribute_code === attrName,
      ),
      'value',
      null,
    );
  };

  renderMetaTags = () => {
    const { product, translate } = this.props;
    const title =
      product.meta_title ||
      `${product.name} | ${translate('product.meta.tops_online')}`;
    const description =
      product.meta_description ||
      `${translate('product.meta.shop_online')} ${product.name} ${translate(
        'product.meta.from',
      )} ${this.getCustomAttribute('brand_name') || ''} ${translate(
        'product.meta.tops_online',
      )}`;
    const keywords =
      product.meta_keyword ||
      compact([
        product.name,
        this.getCustomAttribute('brand_name'),
        get(product, 'breadcrumbs.2.name', null),
        get(product, 'breadcrumbs.0.name', null),
        translate('product.meta.tops_online'),
      ]).join(',');
    return (
      <MetaTags
        canonicalUrl={fullpathUrl(this.props.location)}
        title={title}
        description={description}
        keywords={keywords}
        productView
      />
    );
  };

  renderAccordion = ({ title, content, flag, html = false }) => [
    <div className="separator" />,
    <Accordion>
      <Accordion.Title
        active={this.state[flag]}
        className="accordion-title"
        onClick={() =>
          this.setState({
            [flag]: !this.state[flag],
          })
        }
      >
        <span>
          <h2>{title}</h2>
        </span>
        <Icon name={this.state[flag] ? 'chevron up' : 'chevron down'} />
      </Accordion.Title>
      <Accordion.Content
        active={this.state[flag]}
        className="accordion-content"
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div className="content-box">{content}</div>
        )}
      </Accordion.Content>
    </Accordion>,
  ];

  renderBreadcrumbs() {
    const { translate, product } = this.props;
    let breadcrumbs = [
      {
        label: translate('homepage_text'),
        url: '/',
      },
    ];

    if (!isEmpty(product.breadcrumbs)) {
      product.breadcrumbs.forEach(({ name, url }) => {
        breadcrumbs.push({
          label: name,
          url: `/${url}`,
        });
      });
    }

    breadcrumbs = [
      ...breadcrumbs,
      {
        label: product.name,
        url: `/${product.url_key}`,
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

  getPrice = () => {
    const { product } = this.props;
    const specialPrice =
      product.special_price && Number(product.special_price) !== 0
        ? formatPrice(product.special_price)
        : null;
    const price = formatPrice(product.price);
    const specialPriceToDate =
      product?.extension_attributes?.promotion?.end_date ||
      product?.special_to_date ||
      '';

    let isInRange = false;

    if (specialPriceToDate) {
      const currentTime = moment().format('YYYY-MM-DD HH:mm');
      isInRange = specialPriceToDate
        ? currentTime <=
          moment(specialPriceToDate)
            .add(25200000 - 36000, 'ms')
            .format('YYYY-MM-DD HH:mm')
        : true;
    }

    const showSpecialPrice =
      specialPrice && specialPrice !== price && isInRange;

    return {
      showSpecialPrice,
      price,
      specialPrice,
    };
  };

  renderPriceBlock = () => {
    const { translate, product } = this.props;
    let consumerUnit = this.getCustomAttribute('consumer_unit');
    const weightItemInd = product?.weight_item_ind;
    const sellingUnit = get(product, 'selling_unit', consumerUnit);
    const getPrice = this.getPrice();

    if (weightItemInd === '1' && !isEmpty(sellingUnit)) {
      consumerUnit = sellingUnit;
    }

    return (
      <div className="price-block">
        {get(getPrice, 'showSpecialPrice', false) && [
          <span className="old-price">{get(getPrice, 'price', '0.00')}</span>,
          <span>&nbsp;</span>,
        ]}
        <span className="current-price">
          {get(getPrice, 'showSpecialPrice', false)
            ? get(getPrice, 'specialPrice', '0.00')
            : get(getPrice, 'price', '0.00')}
        </span>
        <span className="price-label">
          {consumerUnit
            ? ` / ${consumerUnit}`
            : translate('product.price_label')}
        </span>
      </div>
    );
  };

  renderButton() {
    const { cart, product, translate } = this.props;

    const transformedProduct = product.custom_attributes
      ? Exploder.explode(product)
      : product;

    transformedProduct.qty =
      find(cart.items, item => item.sku === product.sku)?.qty || 0;

    // GTM Attribute
    const gtm = ProductAddAttribute(product);

    return (
      <CartActionButton
        addToCartLabel={translate('product.add_to_cart')}
        product={transformedProduct}
        gtm={gtm}
        outOfStockLabel={translate('product.out_of_stock')}
      />
    );
  }

  handlePopupSocialShare = (deepLink, w, h) => {
    const dualScreenLeft =
      window.screenLeft != undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop != undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    window.open(
      deepLink,
      '',
      `width=600, height='${h / systemZoom}', top='${top}', left='${left}'`,
    );
  };

  renderSocialShare = () => {
    const { deepLink, title } = this.state;
    return (
      <React.Fragment>
        <div className="title">{this.props.translate('product.share')}</div>
        <div
          className="social-btn"
          onClick={() =>
            this.handlePopupSocialShare(
              `https://www.facebook.com/sharer.php?u=${deepLink}`,
              '900',
              '500',
            )
          }
        >
          <Image src="/assets/icons/social/ic-social-facebook.svg" />{' '}
        </div>
        <div
          className="social-btn"
          onClick={() =>
            this.handlePopupSocialShare(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                deepLink,
              )}&text=${encodeURIComponent(title)}`,
              '900',
              '500',
            )
          }
        >
          <Image src="/assets/icons/social/ic-social-twitter.svg" />{' '}
        </div>
        <div
          className="social-btn"
          onClick={() =>
            this.handlePopupSocialShare(
              `https://social-plugins.line.me/lineit/share?url=${deepLink}`,
              '900',
              '500',
            )
          }
        >
          {' '}
          <Image src="/assets/icons/social/ic-social-line-chat.svg" />{' '}
        </div>
        <a
          className="social-btn"
          href={`mailto:webmaster@example.com?subject=${encodeURIComponent(
            title,
          )}&body=${encodeURIComponent(title)}%0D%0A${encodeURIComponent(
            deepLink,
          )}`}
        >
          <Image src="/assets/icons/social/ic-social-email.svg" />{' '}
        </a>
      </React.Fragment>
    );
  };

  renderAddMicroData = () => {
    const { product, translate } = this.props;
    const getPrice = this.getPrice();
    const isInStock =
      get(product, 'extension_attributes.stock_item.is_in_stock') !== false &&
      !!get(product, 'extension_attributes.stock_item.qty');

    return (
      <span itemscope itemtype="http://schema.org/Product">
        <meta itemprop="sku" content={get(product, 'sku', '')} />
        <meta
          itemprop="image"
          content={this.getImageUrl(get(product, 'image'))}
        />
        <meta itemprop="name" content={get(product, 'name', '')} />
        <meta
          itemprop="description"
          content={
            get(product, 'meta_description', '') ||
            `${translate('product.meta.shop_online')} ${get(
              product,
              'name',
              '',
            )} ${translate('product.meta.from')} ${this.getCustomAttribute(
              'brand_name',
            ) || ''} ${translate('product.meta.tops_online')}`
          }
        />
        <meta
          itemprop="brand"
          content={this.getCustomAttribute('brand_name') || ''}
        />
        <span itemprop="offers" itemscope itemtype="http://schema.org/Offer">
          <meta itemprop="priceCurrency" content="THB" />
          <meta
            itemprop="price"
            content={
              get(getPrice, 'showSpecialPrice', false)
                ? get(getPrice, 'specialPrice', '0.00')
                : get(getPrice, 'price', '0.00')
            }
          />
          <link
            itemprop="itemCondition"
            href="http://schema.org/NewCondition"
          />
          <link
            itemprop="availability"
            href={
              isInStock
                ? 'http://schema.org/InStock'
                : 'http://schema.org/OutOfStock'
            }
          />
        </span>
      </span>
    );
  };

  // Render Methods
  render() {
    const {
      product,
      translate,
      wishlistItems,
      addItemToWishlist,
      removeItemFromWishlist,
      activeLoading,
      storeConfig,
      productBadgeConfig,
    } = this.props;
    const baseMediaUrl = get(storeConfig, 'base_media_url', '');

    if (activeLoading) {
      return (
        <Layout pageType="product">
          <Tabbar />
          <BreadcrumbPreloader />
          <ProductPreloader />
        </Layout>
      );
    }

    const isProduct = get(product, 'id');

    if (!isProduct) {
      return <NotFound />;
    }

    const isAddedToWishList = !!wishlistItems[get(product, 'id', '')];

    const isHasPromotionItem = () => {
      const currentProductPromoNo = get(
        product,
        'extension_attributes.promotion.promotion_no',
        '',
      );
      const isHasMoreData = this.props.bundleProduct?.length > 1;

      const promoType = get(product, 'extension_attributes.promotion.type');
      let isBundle = false;
      if (promoType) {
        isBundle = promoAvailableForBundleLink(promoType);
      }
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let endPromotion = get(product, 'extension_attributes.promotion.end_date')
        ? createDate(
            get(product, 'extension_attributes.promotion.end_date', ''),
          )
        : null;

      if (endPromotion && endPromotion.valueOf() < yesterday.valueOf()) {
        endPromotion = null;
      }
      return endPromotion && currentProductPromoNo && isHasMoreData && isBundle;
    };

    const images = !isEmpty(product.media_gallery_entries)
      ? take(
          product.media_gallery_entries.map(x => this.getImageUrl(x.file)),
          6,
        )
      : [this.getImageUrl(get(product, 'image'))];

    let description = '';
    let ingredient = '';
    let property = '';
    let usage = '';
    if (get(product, 'description')) {
      description = unescape(get(product, 'description', ''))
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    }
    if (get(product, 'product_ingredient')) {
      ingredient = unescape(get(product, 'product_ingredient', ''))
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    }
    if (get(product, 'product_property')) {
      property = unescape(get(product, 'product_property', ''))
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    }
    if (product.product_usage) {
      usage = unescape(get(product, 'product_usage', ''))
        .replace(/{{media url="/g, baseMediaUrl)
        .replace(/"}}/g, '');
    }

    const configProductBadge = find(
      productBadgeConfig,
      config =>
        get(config, 'id', '').toString() === get(product, 'product_badge', ''),
    );

    const productBadge =
      !isEmpty(configProductBadge) &&
      `${baseMediaUrl}${get(configProductBadge, 'image_path', '')}`;

    return (
      <Layout pageType="product" title={product.name}>
        <Tabbar />
        {this.renderMetaTags()}
        {this.renderBreadcrumbs()}
        <div className="product-page-root">
          <div className="content">
            <div className="images">
              <Desktop>
                <SwatchImages images={images} alt={product.name} />
              </Desktop>
              <Tablet>
                <SwatchImagesSlider
                  images={images}
                  alt={product.name}
                  className="product-slider"
                />
              </Tablet>
            </div>
            <div className="common-description">
              <div className="left-block">
                <div className="name">
                  <h1>{product.name}</h1>
                </div>
                <div className="sku">
                  {translate('product.sku')} {product.sku}
                </div>
                <PromoBadgesIcons product={product} />
                <Tablet>{this.renderPriceBlock()}</Tablet>
                <PromoBadgesNames product={product} />
                {!isEmpty(configProductBadge) && (
                  <div className="seasonal-badge">
                    <img
                      className="seasonal-image"
                      src={productBadge}
                      title={get(configProductBadge, 'label', '')}
                    />
                    <p className="seasonal-label">
                      {get(configProductBadge, 'label', '')}
                    </p>
                  </div>
                )}
              </div>
              <div className="right-block">
                <div
                  className="like-block"
                  onClick={() => {
                    return isAddedToWishList
                      ? removeItemFromWishlist(product.id)
                      : addItemToWishlist(
                          product.id,
                          `${window.location.pathname}${window.location.search}`,
                        );
                  }}
                >
                  <Icon
                    name="like"
                    size="big"
                    className={isAddedToWishList ? 'active' : ''}
                  />
                  &nbsp; {translate('wishlist.add_my_list')}
                </div>
                <Desktop>{this.renderPriceBlock()}</Desktop>
                <div className="add-to-cart">
                  <div className="add-to-cart-relative">
                    <NotifyTooltip product={product} />
                    {this.renderButton()}
                  </div>
                </div>
                <div className="social-share">
                  {this.state.deepLink !== '' && this.renderSocialShare()}
                </div>
              </div>
            </div>
          </div>

          {(product.product_property ||
            product.product_ingredient ||
            product.product_usage) &&
            this.renderAccordion({
              title: translate('product.specification'),
              content: (
                <div className="specification">
                  {product.product_property && (
                    <div className="property">
                      <span className="property_title">
                        {translate('product.product_property')}
                      </span>
                      <span className="colon">:</span>
                      <span
                        className="text"
                        dangerouslySetInnerHTML={{ __html: property }}
                      />
                    </div>
                  )}
                  {product.product_ingredient && (
                    <div className="ingredient">
                      <span className="ingredient_title">
                        {translate('product.product_ingredient')}
                      </span>
                      <span className="colon">:</span>
                      <span
                        className="text"
                        dangerouslySetInnerHTML={{ __html: ingredient }}
                      />
                    </div>
                  )}
                  {product.product_usage && (
                    <div className="usage">
                      <span className="usage_title">
                        {translate('product.product_usage')}
                      </span>
                      <span className="colon">:</span>
                      <span
                        className="text"
                        dangerouslySetInnerHTML={{ __html: usage }}
                      />
                    </div>
                  )}
                </div>
              ),
              flag: 'specificationActive',
            })}

          {isHasPromotionItem() && (
            <div id="mix-add-match" ref={elem => (this.productBundle = elem)}>
              {this.renderAccordion({
                title: translate('product.mix_and_match'),
                flag: 'promotionBundle',
                content: (
                  <div>
                    <PromoBundleList
                      promoNo={get(
                        product,
                        'extension_attributes.promotion.promotion_no',
                        '',
                      )}
                    />
                    <PreloadedProductCarousel
                      id="mix-add-match-product"
                      className="carousel--mix-add-match"
                      sortingFunc={(a, b) => {
                        const asc =
                          a.extension_attributes.stock_item.qty <
                          b.extension_attributes.stock_item.qty;
                        const matchFirst =
                          a.sku === product.sku
                            ? -1
                            : b.sku === product.sku
                            ? 1
                            : 0;
                        return matchFirst || asc;
                      }}
                      ownProducts={this.props.bundleProduct}
                      // filterFunc={item => item.promotion_no === product.promotion_no}
                      wishlistItems={wishlistItems}
                      onAddToWishlist={addItemToWishlist}
                      onRemoveFromWishlist={removeItemFromWishlist}
                      section="Mix add Match products"
                      isCustomSlide
                    />
                  </div>
                ),
              })}
            </div>
          )}

          {description &&
            this.renderAccordion({
              title: translate('product.description'),
              content: description,
              flag: 'descriptionActive',
              html: true,
            })}
        </div>
        <div className="insider-sr-product"></div>

        <SimAndAssoProductCarousel sku={product?.sku} />

        <PreloadedProductCarousel
          id="relate-product"
          ownProducts={this.props.relatedProduct}
          title={translate('product.related')}
          wishlistItems={wishlistItems}
          onAddToWishlist={addItemToWishlist}
          onRemoveFromWishlist={removeItemFromWishlist}
          section="Related products"
          isCustomSlide
        />

        {this.renderAddMicroData()}
      </Layout>
    );
  }
}

ProductPage.defaultProps = {
  wishlistItems: {},
  addItemToWishlist: noop,
  removeItemFromWishlist: noop,
  fetchWishlist: noop,
};

ProductPage.propTypes = {
  cart: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  product: PropTypes.object.isRequired,
  storeConfig: PropTypes.object.isRequired,
  fetchProductDetail: PropTypes.func.isRequired,
  fetchProductByFilter: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  fetchProductBundle: PropTypes.func.isRequired,
  wishlistItems: PropTypes.object,
  addItemToWishlist: PropTypes.func,
  removeItemFromWishlist: PropTypes.func,
  fetchWishlist: PropTypes.func,
  isReload: PropTypes.bool.isRequired,
  productDataLayer: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { match }) => {
  const productBySku = findProductBySlug(state, match.params.slug);
  return {
    cart: state.cart.cart,
    productDataLayer: ProductNoQty(productBySku.data),
    product: !isEmpty(productBySku.data)
      ? Exploder.explode(productBySku.data)
      : null,
    products: state.product.items,
    activeLoading: productBySku.isFetching,
    storeConfig: state.storeConfig.current,
    translate: getTranslate(state.locale),
    wishlistItems: getWishlistItmesByProductId(state),
    relatedProduct: state.product.related,
    bundleProduct: state.product.bundle,
    isReload: productBySku.isReload,
    payment: state.checkout.payment,
    customer: getCustomerSelector(state),
    similar: state.product.similar,
    envConfig: state.storeConfig.envConfig,
    loadingSimilar: state.product.loadingSimilar,
    productBadgeConfig: state.product.productBadge.items,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchProductByFilter,
      fetchProductDetail,
      fetchProductBundle,
      addItemToWishlist: addtoWishlist,
      removeItemFromWishlist: removeFromWishlist,
      fetchWishlist,
      checkDefaultShipping,
      deeplinkPDP: product => deeplinkPDP(product),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);
