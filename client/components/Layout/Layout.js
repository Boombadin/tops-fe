import { breakpoint } from '@central-tech/core-ui';
import { filter, find, get as prop, includes, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { PureComponent } from 'react';
import LazyLoad from 'react-lazyload';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import { withRouter } from 'react-router-dom';
import { StickyContainer } from 'react-sticky';
import styled from 'styled-components';

import RoyalHeader from '../../components/RoyalHeader';
import NoSelectMethodModal from '../../components/ShippingOptionsTab/NoSelectMethodModal';
import AdultConfirmatinoModal from '../../features/modal/AdultConfirmationModal';
import DeliveryToolBarModal from '../../features/modal/DeliveryToolBarModal';
import { withCheckoutNYB } from '../../features/nyb';
import { ErrorNYBModal } from '../../magenta-ui';
import {
  closeModalErrorNYB,
  closeNoStockModal,
  modalNotSelectMethod,
} from '../../reducers/cart';
import { fetchCategory } from '../../reducers/category';
import {
  closeLoginSidebar,
  onBoardingDeliveryOpen,
  setPageWidth,
  setSidebar,
} from '../../reducers/layout';
import { closePromoBundleModal } from '../../reducers/promoBundle';
import {
  getCustomerSelector,
  isAppGrab,
  isCustomerLoggedInSelector,
} from '../../selectors';
import { initAccessTrade } from '../../utils/accesstrade';
import { getCookie } from '../../utils/cookie';
import Footer from '../Footer';
import FullPageLoader from '../FullPageLoader';
import MainHeader from '../MainHeader/MainHeader';
import MobileSearchBar from '../MobileSearchBar';
import PromoBundleModal from '../PromoBundleModal';
import Sidebar from '../Sidebar';
import LayoutContainer from './LayoutContainer';

const BackgroundOnBoarding = styled.div`
  display: none;

  ${breakpoint('xs', 'md')`
    display: ${({ isShowBackground }) => (isShowBackground ? 'block' : 'none')};
    background-color: #000000;
    position: fixed;
    width: 100%;
    z-index: 1000;
    opacity: 0.9;
    top: 0;
    left: 0;
    bottom: 0;
  `}
`;

class Layout extends PureComponent {
  static propTypes = {
    categories: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.node,
    activeCategory: PropTypes.string,
    title: PropTypes.string,
    noStockModal: PropTypes.object,
    closeNoStockModal: PropTypes.func.isRequired,
    header: PropTypes.node,
    lang: PropTypes.oneOf(['th_TH', 'en_US']).isRequired,
    customItems: PropTypes.node,
    errorNotSelectMethod: PropTypes.bool,
    cmsBlock: PropTypes.array,
    customer: PropTypes.object,
    showModalStoreLocator: PropTypes.bool,
    disableSearch: PropTypes.bool,
    isGrabProvider: PropTypes.bool,
    pageType: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    noStockModal: {},
    categories: [],
    activeCategory: '',
    title: '',
    children: null,
    customItems: null,
    errorNotSelectMethod: false,
    cmsBlock: [],
    customer: {},
    showModalStoreLocator: false,
    disableSearch: false,
    isGrabProvider: false,
    pageType: '',
  };

  state = {
    visible: false,
    vpvPushed: false,
    currentPage: '',
  };

  componentDidMount() {
    if (!isEmpty(this.props.location.search)) {
      const params = queryString.parse(this.props.location.search);
      if (!isEmpty(params.utm_source) && params.utm_source === 'interspace') {
        initAccessTrade();
      }
    }

    const screenMobile = window.matchMedia('(max-width: 769px)');
    if (this.props.showOnBoarding && screenMobile.matches) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }

    if (this.props.isCustomerLogged && isEmpty(this.props.currentShipping)) {
      if (isEmpty(getCookie(`onboarding_${prop(this.props.customer, 'id')}`))) {
        this.props.onBoardingDeliveryOpen();
      }
    }

    if (this.props.isLoading === undefined) {
      this.optimizeActivate();
    }
  }

  componentDidUpdate() {
    if (this.state.currentPage !== this.props.location.pathname) {
      if (!this.state.vpvPushed) {
        if (this.props.isLoading === undefined) {
          this.virtualPageView();
          this.optimizeActivate();
        }
        this.initialImpressions();
        this.setState({
          vpvPushed: true,
          currentPage: this.props.location.pathname,
        });
      }
    }

    const screenMobile = window.matchMedia('(max-width: 769px)');
    if (
      this.props.showOnBoarding &&
      screenMobile.matches &&
      this.props.isShowBackground
    ) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'visible';
      document.body.style.overflow = 'visible';
    }
  }

  virtualPageView() {
    dataLayer.push({
      event: 'vpv',
      provider: !isEmpty(getCookie('provider')) ? getCookie('provider') : 'web',
      customer_id: prop(this.props.customer, 'id', ''),
      email: prop(this.props.customer, 'email', ''),
      page: {
        pagePath: this.props.location.pathname,
        pageTitle: document.title,
        pageLang: this.props.lang,
        pageType: this.props.pageType,
      },
    });
  }

  optimizeActivate() {
    dataLayer.push({ event: 'optimize.activate' });
  }

  initialImpressions() {
    dataLayer.push({
      event: 'productImpressions',
      ecommerce: {
        currencyCode: 'THB',
        impressions: [],
      },
      _clear: true,
    });
  }

  leftToggleVisibility = () => this.setState({ visible: !this.state.visible });

  handleCloseSidebar = () => {
    this.setState({ visible: false });
    this.props.closeLoginSidebar();
  };

  handleOpenSearchSuggestion = () => {
    this.setState({ mobileSearchOpen: true });
  };

  handleCloseSearchSuggestion = () =>
    this.setState({ mobileSearchOpen: false });

  handleToHome = () => {
    window.scrollTo(0, 0);
    this.props.history.push('/');
  };

  handleToCheckout = () => {
    const { isCustomerLogged } = this.props;
    if (isCustomerLogged) {
      this.props.history.push('/checkout');
    } else {
      window.location = `/login?ref=${window.location.href}`;
    }
  };

  render() {
    const { visible } = this.state;
    const {
      translate,
      title,
      description,
      header,
      noStockModal,
      lang,
      sidebarActiveTab,
      activeCategory,
      storeConfig,
      closeModalErrorNYB,
      closePromoBundleModal,
      disableFooter,
      backLabelButton,
      onHandleBack,
      customItems,
      className,
      errorNYBModal,
      errorNotSelectMethod,
      closeModalNotSelectMethod,
      cmsBlock,
      customer,
      showModalDeliveryToolBar,
      disableSearch,
      isGrabProvider,
      promoOpen,
      onBoardingCart,
      showOnBoarding,
      isShowBackground,
    } = this.props;
    let noStockItem = prop(noStockModal, 'item');
    const noStockItemFile = prop(noStockItem, 'image');

    if (noStockItemFile) {
      noStockItem = {
        ...noStockItem,
        image: `${storeConfig.base_media_url}/catalog/product${noStockItemFile}`,
      };
    }

    let filterData;
    if (!isGrabProvider) {
      filterData = filter(cmsBlock, val => {
        return (
          includes(
            val.identifier,
            !isEmpty(customer)
              ? 'promo_banner_homepage_customer'
              : 'promo_banner_homepage_guest',
          ) && val.active === true
        );
      });
    }

    const bannerLocationFooter =
      this.props.location.pathname.split('/').pop() || '-';

    return (
      <React.Fragment>
        {showOnBoarding && (
          <BackgroundOnBoarding isShowBackground={isShowBackground} />
        )}
        <RoyalHeader
          className="promo-top-banner"
          baseMediaUrl={storeConfig.base_media_url}
          cmsBlock={cmsBlock}
          isGrabProvider={isGrabProvider}
        />
        <StickyContainer>
          <div id="layout" className={className}>
            <LoadingBar
              className="top-progress-bar"
              updateTime={100}
              maxProgress={95}
              progressIncrease={10}
              style={{
                backgroundColor: 'red',
                height: '2px',
                position: 'fixed',
                zIndex: 9999,
              }}
            />
            <div className="container">
              {header || (
                <MainHeader
                  title={title}
                  handleToHome={() => this.handleToHome()}
                  handleToCheckout={() => this.handleToCheckout()}
                  description={description}
                  onBurgerClick={this.leftToggleVisibility}
                  isBackLabel={backLabelButton}
                  onClickBack={onHandleBack}
                  cmsBlock={cmsBlock}
                  isCustomer={!isEmpty(customer)}
                  baseMediaUrl={storeConfig.base_media_url}
                  translate={translate}
                  actionOpenSearchSuggest={this.handleOpenSearchSuggestion}
                  disableSearch={disableSearch}
                  isGrabProvider={isGrabProvider}
                  onBoardingCart={onBoardingCart}
                />
              )}
              <Sidebar
                activeCategory={activeCategory}
                visible={visible}
                handleCloseSidebar={this.handleCloseSidebar}
                customItems={customItems}
              />
              <LayoutContainer
                className={this.props.className}
                // classNameUpperHeader={
                //   !isEmpty(filterData) ? 'upper-header-banner' : 'royal-header-banner'
                // }
                active={sidebarActiveTab !== -1}
                classNameSearchBar={disableSearch ? 'disable-search' : ''}
              >
                {this.props.children}
                {!disableFooter && (
                  <LazyLoad height={800} once>
                    <Footer
                      bannerLocation={
                        `FT|${bannerLocationFooter}|` + `Ads Banner`
                      }
                    />
                  </LazyLoad>
                )}
              </LayoutContainer>
            </div>

            {promoOpen && (
              <PromoBundleModal onCloseButton={closePromoBundleModal} />
            )}

            {/* <NoStockModal
              lang={lang}
              open={noStockItem}
              items={noStockItem ? [noStockItem] : []}
              onConfirm={closeNoStockModal}
              onCloseButton={closeNoStockModal}
            /> */}

            <ErrorNYBModal
              lang={lang}
              open={prop(errorNYBModal, 'show')}
              message={prop(errorNYBModal, 'item.error.text')}
              onConfirm={closeModalErrorNYB}
              onCloseButton={closeModalErrorNYB}
            />

            <NoSelectMethodModal
              visible={errorNotSelectMethod}
              translate={translate}
              onClose={closeModalNotSelectMethod}
            />

            {this.state.mobileSearchOpen && (
              <MobileSearchBar
                closeSearchSuggestion={this.handleCloseSearchSuggestion}
              />
            )}

            <FullPageLoader
              show={this.props.fullPageLoading}
              message={this.props.fullPageMessage}
            />

            {/* <StoreSelectorModal open={showModalStoreLocator} /> */}

            <DeliveryToolBarModal
              currentShipping={this.props.currentShipping}
              open={showModalDeliveryToolBar}
              lang={this.props.lang}
            />

            <AdultConfirmatinoModal />
          </div>
        </StickyContainer>
      </React.Fragment>
    );
  }
}

// TODO: move props to specific component to prevent layout component from re-render;
const mapStateToProps = (state, ownProps) => ({
  pageWidth: state.layout.pageWidth,
  fullPageLoading: state.layout.fullPageLoading,
  fullPageMessage: state.layout.fullPageMessage,
  sidebarActiveTab: state.layout.sidebarActiveTab,
  categories: state.category.items,
  categoriesLoading: state.category.loading,
  category: find(
    state.category.items,
    categ => categ.id.toString() === ownProps.activeCategory,
  ),
  customer: getCustomerSelector(state),
  storeConfig: state.storeConfig.current,
  translate: getTranslate(state.locale),
  cart: state.cart.cart,
  itemsCount: state.cart.itemsCount,
  noStockModal: state.cart.noStockModal,
  errorNYBModal: state.cart.errorAddNYB,
  errorNotSelectMethod: state.cart.showModalNotSelectMethod,
  promoOpen: state.promoBundle.modalOpen,
  lang: find(state.locale.languages, lang => lang.active === true).code,
  cmsBlock: state.cmsBlock.items,
  showModalStoreLocator: state.cart.showModalStoreLocator,
  showModalDeliveryToolBar: state.customer.showModalDeliveryToolBar,
  isGrabProvider: isAppGrab(state),
  currentShipping: state.customer.currentShipping,
  isCustomerLogged: isCustomerLoggedInSelector(state),
  onBoardingCart: state.layout.onBoardingCart,
  showOnBoarding:
    state.layout.onBoardingDelivery || state.layout.onBoardingCart,
});

const mapDispatchToProps = dispatch => ({
  setPageWidth: width => dispatch(setPageWidth(width)),
  closeNoStockModal: () => dispatch(closeNoStockModal()),
  closeModalErrorNYB: () => dispatch(closeModalErrorNYB()),
  setSidebar: status => dispatch(setSidebar(status)),
  closeLoginSidebar: () => dispatch(closeLoginSidebar()),
  closePromoBundleModal: () => dispatch(closePromoBundleModal()),
  closeModalNotSelectMethod: () => dispatch(modalNotSelectMethod(false)),
  fetchCategory: () => dispatch(fetchCategory()),
  onBoardingDeliveryOpen: () => dispatch(onBoardingDeliveryOpen()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withCheckoutNYB(Layout)),
);
