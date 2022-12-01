import React, { PureComponent } from 'react';
import { func, number, object } from 'prop-types';
import { connect } from 'react-redux';
import { map, get } from 'lodash';
import PreloadHeroBannerV2 from '../../components/PreloadHeroBannerV2';
import { makeGetBannerKeys, makeGetStoreConfig } from './redux/bannerSelector';
import { fetchBannerByCategoryId } from './redux/bannerActions';

class BannerListContainer extends PureComponent {
  static propTypes = {
    fetchBannerByCategoryId: func.isRequired,
    bannerKeys: object.isRequired,
    categoryId: number.isRequired,
  };

  componentDidMount() {
    const { bannerKeys, categoryId } = this.props;
    const isReload = get(bannerKeys, `${categoryId}.isReload`, true);
    if (isReload) {
      this.props.fetchBannerByCategoryId(categoryId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { categoryId, bannerKeys } = this.props;
    if (prevProps.categoryId !== categoryId) {
      const isReload = get(bannerKeys, `${categoryId}.isReload`, true);
      if (isReload) {
        this.props.fetchBannerByCategoryId(categoryId);
      }
    }
  }

  render() {
    const { categoryId, bannerKeys, storeConfig } = this.props;
    const banners = get(bannerKeys, `${categoryId}.data`, []);
    const isFetching = get(bannerKeys, `${categoryId}.isFetching`, []);
    return map(banners, banner => (
      <PreloadHeroBannerV2
        id="hero-banner-category"
        className="hero-banner-category"
        banner={banner}
        loading={isFetching}
        config={storeConfig}
      />
    ));
  }
}
const makeMapStateToProps = () => {
  const getBannerKeys = makeGetBannerKeys();
  const getStoreConfig = makeGetStoreConfig();
  return state => ({
    bannerKeys: getBannerKeys(state),
    storeConfig: getStoreConfig(state),
  });
};
const mapDispatchToProps = {
  fetchBannerByCategoryId,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(BannerListContainer);
