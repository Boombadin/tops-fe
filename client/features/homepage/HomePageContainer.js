import get from 'lodash/get';
import noop from 'lodash/noop';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import uuidV4 from 'uuid/v4';

import '@client/components/ShopByBrand/ShopByBrandList.scss';
import '@client/components/ShopByCountry/ShopByCountryList.scss';
import CMSBlock from '@client/components/CMSBlock';
import DeliveryToolBar from '@client/components/MainHeader/components/DeliveryToolBar';
import ShopByBrandItem from '@client/components/ShopByBrand/ShopByBrandItem';
import ShopByCountryItem from '@client/components/ShopByCountry/ShopByCountryItem';
import SpCate from '@client/components/SpCate/SpCate';
import Tabbar from '@client/components/Tabbar';
import SeasonalProductCarousel from '@client/features/campaign/SeasonalProductCarousel';
import CampaignCatalog from '@client/features/homepage/components/CampaignCatalog';
import CarouselBanner from '@client/features/homepage/components/CarouselBanner';
import HeroBanner from '@client/features/homepage/components/HeroBanner';
import PDPA from '@client/features/homepage/components/PDPA';
import PromotionBanner from '@client/features/homepage/components/PromotionBanner';
import PromotionProductCarousel from '@client/features/homepage/components/PromotionProductCarousel';
import RecommendedProductCarousel from '@client/features/homepage/components/RecommendedProductCarousel';
import WhyUsBanner from '@client/features/homepage/components/WhyUsBanner';
import withCustomer from '@client/hoc/withCustomer';
import withFirebaseContext from '@client/hoc/withFirebaseContext';
import withLocales from '@client/hoc/withLocales';
import withStoreConfig from '@client/hoc/withStoreConfig';
import { checkDefaultShipping } from '@client/reducers/cart';
import { fetchWishlist } from '@client/reducers/wishlist';
import { isCustomerLoggedInSelector } from '@client/selectors';

const ShowDeliveryToolBar = styled.div`
  display: none;
  @media only screen and (max-width: 991px) {
    display: block;
  }
`;
@withStoreConfig
@withLocales
@withCustomer
@withFirebaseContext
class HomePageContainer extends Component {
  static defaultProps = {
    fetchWishlist: noop,
  };

  static propTypes = {
    translate: PropTypes.func.isRequired,
    fetchWishlist: PropTypes.func,
    firestoreAction: PropTypes.func.isRequired,
  };

  state = {
    isShowSeasonalCarousel: false,
    seasonalConfig: null,
  };

  async componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.isCustomerLogged) {
      this.props.fetchWishlist();
    }

    this.setState({
      seasonalConfig: await this.props.firestoreAction.getSeasonalConfig(),
    });
  }

  async componentDidUpdate(_prevProps, prevState) {
    if (!this.state.seasonalConfig) {
      this.setState({
        seasonalConfig: await this.props.firestoreAction.getSeasonalConfig(),
      });
    }

    if (this.state.seasonalConfig !== prevState.seasonalConfig) {
      const currentDatetime = moment();
      const startAt = moment.unix(this.state.seasonalConfig?.start?.seconds);
      const endAt = moment.unix(this.state.seasonalConfig?.end?.seconds);
      const isShowSeasonalCarousel =
        currentDatetime.isSameOrAfter(startAt) &&
        currentDatetime.isBefore(endAt);

      this.setState({
        isShowSeasonalCarousel,
      });
    }
  }

  render() {
    const {
      translate,
      currentShipping,
      isCustomerLogged,
      langCode,
      customer,
    } = this.props;

    return (
      <div id="homepage">
        <h1 className="hidden">Tops online ท็อปส์ ออนไลน์</h1>
        <Tabbar />
        <HeroBanner bannerLocation={'HP|-|Hero Banner'} />
        {isCustomerLogged && (
          <ShowDeliveryToolBar>
            <DeliveryToolBar
              currentShipping={currentShipping}
              onClick={this.props.showDeliveryToolBar}
              color="#ec1d24"
              lang={langCode}
            />
          </ShowDeliveryToolBar>
        )}
        <SpCate />
        {this.state.isShowSeasonalCarousel && (
          <LazyLoad height={400} once>
            <SeasonalProductCarousel />
          </LazyLoad>
        )}
        <LazyLoad height={400} once>
          <CampaignCatalog />
        </LazyLoad>
        <div className="insider-sr-home-1"></div>
        <LazyLoad height={400} once>
          <RecommendedProductCarousel />
        </LazyLoad>
        <LazyLoad height={400} once>
          <PromotionBanner bannerLocation={'HP|-|'} />
        </LazyLoad>
        <LazyLoad height={500} once>
          <CarouselBanner
            bannerId="brand"
            title={translate('brands')}
            titlePosition="left"
            titleLine={false}
            button={false}
            bannerName="Shop in Shop"
            renderItem={(slide, idx) => (
              <ShopByBrandItem
                index={idx}
                slide={slide}
                key={uuidV4()}
                bannerLocation={'HP|-|Brands'}
              />
            )}
          />
        </LazyLoad>
        <LazyLoad height={500} once>
          <CarouselBanner
            bannerId="country"
            title={translate('imported_products')}
            titlePosition="left"
            titleLine={false}
            button={false}
            bannerName="Shop By Country"
            renderItem={(slide, idx) => (
              <ShopByCountryItem
                index={idx}
                slide={slide}
                key={uuidV4()}
                bannerLocation={'HP|-|International products'}
              />
            )}
          />
        </LazyLoad>
        <LazyLoad height={500} once>
          <PromotionProductCarousel />
        </LazyLoad>
        <div className="insider-sr-home-2"></div>
        <LazyLoad height={800} once>
          <CMSBlock
            className="special-banner"
            identifier="homepage_special_banner_1"
            bannerLocation={'HP|-|Special Banner'}
          />
          <CMSBlock
            className="special-banner"
            identifier="homepage_special_banner_2"
            bannerLocation={'HP|-|Special Banner'}
          />
        </LazyLoad>
        <LazyLoad height={200} once>
          <WhyUsBanner />
        </LazyLoad>
        {isCustomerLogged && (
          <PDPA
            email={get(customer, 'email', '')}
            id={get(customer, 'id', '')}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentShipping: state.customer.currentShipping,
  isCustomerLogged: isCustomerLoggedInSelector(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchWishlist,
      checkDefaultShipping,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
